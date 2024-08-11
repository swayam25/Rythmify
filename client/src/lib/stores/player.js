import { user } from "$lib/stores/user";
import { db } from "$lib/websockets/db";
import { song } from "$lib/websockets/song";
import { writable } from "svelte/store";

function Player() {
    let $song = {};
    song.subscribe((value) => {$song = value;});
    let userID = 0;
    user.subscribe((value) => {userID = value.id;});
    const { subscribe, set, update } = writable({
        current: {
            stream: "",
            meta: {},
            index: 0
        },
        loading: false,
        queue: [],
        paused: true,
        playlist: ""
    });

    // Fetches song metadata from database
    async function fetchMeta(songID) {
        let songMeta = {};
        if($song.info.hasOwnProperty(songID)) {
            songMeta = $song.info[songID];
        } else {
            await song.info(songID);
            while(Object.keys($song.info).length === 0 || !$song.info.hasOwnProperty(songID)) {
                await new Promise(r => setTimeout(r, 100));
            }
            songMeta = $song.info[songID];
        }
        return songMeta;
    }

    return {
        subscribe, set, update,
        async play(songID, force = false, queue = false) {
            if(userID !== 0 && userID !== 1) {
                await db.addHistory(songID);
            }
            update((data) => {
                if((data.paused && data.queue.length === 0) || force || queue) {
                    data.loading = true;
                    data.paused = true;
                }
                return data;
            });
            const songMeta = await fetchMeta(songID);
            update((data) => {
                if((data.paused && data.queue.length === 0) || force) {
                    data.queue = [songMeta];
                    data.current.index = 0;
                    this.setSong(songID);
                } else if(queue) {
                    data.current.index = data.queue.findIndex((song) => song.id === songID);
                    this.setSong(songID);
                } else {
                    data.queue = data.queue.filter((song) => song.id !== songID);
                    data.queue.push(songMeta);
                }
                data.playlist = "";
                return data;
            });
        },
        async removeQueue(songID) {
            update((data) => {
                data.queue = data.queue.filter((song) => song.id !== songID);
                return data;
            });
        },
        async addMassQueue(songIDs) {
            let info = [];
            for(let songID of songIDs) {
                info.push(await fetchMeta(songID));
                if(userID !== 0 && userID !== 1) {
                    await db.addHistory(songID);
                }
            }
            update((data) => {
                data.queue = info;
                return data;
            });
        },
        async clearQueue() {
            update((data) => {
                data.queue = [];
                data.current.stream = "";
                data.current.meta = {};
                data.current.index = 0;
                data.loading = false;
                data.paused = true;
                data.playlist = "";
                return data;
            });
        },
        async pause() {
            update((data) => {
                data.paused = true;
                return data;
            });
        },
        async resume() {
            update((data) => {
                data.paused = false;
                return data;
            });
        },
        async setSong(songID) {
            const songMeta = await fetchMeta(songID);
            let stream = $song.info[songID]?.stream;
            if(!stream) {
                await song.stream(songID);
                while(!($song.info[songID]?.stream)) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                stream = $song.info[songID].stream;
            } else if(stream === "NONE") {
                stream = "";
            }
            update((data) => {
                data.current.stream = stream;
                data.current.meta = songMeta;
                return data;
            });
        },
        async setPlaylist(name) {
            update((data) => {
                data.playlist = name;
                return data;
            });
        },
        async renamePlaylist(name, newName) {
            update((data) => {
                if(data.playlist === name) {
                    data.playlist = newName;
                }
                return data;
            });
        },
        async current(num) {
            update((data) => {
                data.current.index = num;
                return data;
            });
        },
        async loading(type) {
            update((data) => {
                data.loading = type;
                return data;
            });
        },
        async getLyrics() {
            let songID = 0;
            subscribe((data) => {songID = data.current.meta.id;});
            let lyrics = $song.info[songID]?.lyrics;
            if(!lyrics) {
                await song.lyrics(songID);
                while(!($song.info[songID]?.lyrics)) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                lyrics = $song.info[songID].lyrics;
            }
            if(lyrics === "NONE") {
                lyrics = null;
            }
            return lyrics;
        }
    }
}

export const player = Player();