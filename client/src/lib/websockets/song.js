import config from "../../../../config.json";
import { user } from "$lib/stores/user";
import { writable } from "svelte/store";

function Song() {
    let socket = null;
    let userID = 0;
    const { subscribe, set, update } = writable({
        home: [],
        trending: [],
        search: [],
        info: {},
        error: ""
    });

    return {
        subscribe, set, update,
        async connect() {
            user.subscribe((value) => {userID = value.id === 1 || value.id === 0 ? Math.floor(Math.random() * 10000) : value.id;});
            socket = new WebSocket(`${config.server.includes("https://") ? config.server.replace("https://", "wss://") : config.server.replace("http://", "ws://")}/song/ws?user_id=${userID}`);
            socket.addEventListener("open", () => {
                console.log("[SONG] Connected")
                socket.send(JSON.stringify({type: "base"}));
            });
            socket.addEventListener("message", (event) => {
                const data = JSON.parse(event.data);
                if(data.type === "base") {
                    update((value) => {
                        value.home = data.home;
                        value.trending = data.trending;
                        return value;
                    });
                } else if(data.type === "search") {
                    update((value) => {
                        value.search = data.results;
                        return value;
                    });
                } else if(data.type === "info") {
                    update((value) => {
                        for(const key of Object.keys(data.results)) {
                            value.info[key] = data.results[key];
                        }
                        return value;
                    });
                } else if(data.type === "lyrics") {
                    update((value) => {
                        let key = Object.keys(data.results)[0];
                        if(data.results[key] !== "NONE") {
                            value.info[key].lyrics = data.results[key];
                        } else {
                            value.error = "Lyrics not found";
                        }
                        return value;
                    });
                } else if(data.type === "stream") {
                    update((value) => {
                        let key = Object.keys(data.results)[0];
                        if(data.results[key] !== "NONE") {
                            value.info[key].stream = data.results[key];
                        } else {
                            value.error = "Song not found";
                        }
                        return value;
                    });
                }
            });
            socket.addEventListener("close", () => {
                console.log("[SONG] Disconnected");
                console.log("[SONG] Reconnecting in 2 seconds...");
                setTimeout(() => {
                    this.connect();
                }, 2000);
            });
            socket.addEventListener("error", (error) => {
                console.log("[SONG] Error:", error);
            });
        },
        async search(query) {
            socket.send(JSON.stringify({type: "search", query: query}));
        },
        async clearSearch() {
            update((value) => {
                value.search = [];
                return value;
            });
        },
        async info(id) {
            socket.send(JSON.stringify({type: "info", id: id}));
        },
        async lyrics(id) {
            socket.send(JSON.stringify({type: "lyrics", id: id}));
        },
        async stream(id) {
            socket.send(JSON.stringify({type: "stream", id: id}));
        },
    }
}

export const song = Song();