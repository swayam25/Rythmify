import config from "../../../../config.json";
import { writable } from "svelte/store";
import { user } from "$lib/stores/user";
import { song } from "$lib/websockets/song";

function DB() {
    let socket = null;
    let userID = 0;
    user.subscribe((value) => {userID = value.id;});
    let $song = {};
    song.subscribe((value) => {$song = value;});
    const { subscribe, set, update } = writable({
        history: [],
        playlist: {},
        error: ""
    });

    // Array in Object
    function checkArrayInObject(arr, obj) {
        for(const key of arr) {
            if(!obj.hasOwnProperty(key)) {
            return false;
            }
        }
        return true;
    }

    return {
        subscribe, set, update,
        async connect() {
            socket = new WebSocket(`${config.server.includes("https://") ? config.server.replace("https://", "wss://") : config.server.replace("http://", "ws://")}/db/ws?user_id=${userID}`);
            socket.addEventListener("open", () => {
                console.log("[DB] Connected");
                socket.send(JSON.stringify({type: "get"}));
            });
            socket.addEventListener("message", async(event) => {
                let data = JSON.parse(event.data);
                let mainData = data.results;

                // Get Data
                if(data.type === "get") {
                    // Get history
                    let realData = [];
                    let loadSongs = [];
                    if(mainData.history.length > 0) {
                        for(const id of mainData.history) {
                            if(!checkArrayInObject([id], $song.info)) {
                                loadSongs.push(id);
                            }
                        }
                        if(loadSongs.length > 0) {
                            await song.info(loadSongs.join(","));
                            while(Object.keys($song.info).length === 0 || !checkArrayInObject(loadSongs, $song.info)) {
                                await new Promise((resolve) => setTimeout(resolve, 100));
                            }
                        }
                        for(const id of mainData.history) {
                            for(const id2 of Object.keys($song.info)) {
                                if(id === id2) {
                                    realData.push($song.info[id]);
                                }
                            }
                        }
                    } else {
                        realData = ["EMPTY"];
                    }
                    update((state) => {
                        state.history = realData;
                        return state;
                    });

                    // Get playlist
                    let realData2 = {};
                    let plName = Object.keys(mainData.playlist);
                    if(plName.length > 0) {
                        for(let name of plName) {
                            let plSongs = [];
                            let loadSongs = [];
                            if(mainData.playlist[name].length > 0) {
                                for(const id of mainData.playlist[name]) {
                                    if(!checkArrayInObject([id], $song.info)) {
                                        loadSongs.push(id);
                                    }
                                }
                                if(loadSongs.length > 0) {
                                    await song.info(loadSongs.join(","));
                                    while(Object.keys($song.info).length === 0 || !checkArrayInObject(loadSongs, $song.info)) {
                                        await new Promise((resolve) => setTimeout(resolve, 100));
                                    }
                                }
                                for(const id of mainData.playlist[name]) {
                                    for(const id2 of Object.keys($song.info)) {
                                        if(id === id2) {
                                            plSongs.push($song.info[id]);
                                        }
                                    }
                                }
                            } else {
                                plSongs = ["EMPTY"];
                            }
                            realData2[name] = plSongs;
                        }
                    } else {
                        realData2.empty = "EMPTY";
                    }
                    update((state) => {
                        state.playlist = realData2;
                        return state;
                    });
                } else if(data.type === "add_history") { // Add history
                    let loadedData = [];
                    subscribe((data) => {loadedData = data.history;})
                    loadedData = loadedData[0] === "EMPTY" ? [] : loadedData;
                    loadedData = loadedData.filter((e) => e.id !== mainData);
                    if(checkArrayInObject([mainData], $song.info)) {
                        loadedData.push($song.info[mainData]);
                    } else {
                        await song.info(mainData);
                        while(Object.keys($song.info).length === 0 || !checkArrayInObject([mainData], $song.info)) {
                            await new Promise((resolve) => setTimeout(resolve, 100));
                        }
                        loadedData.push($song.info[mainData]);
                    }
                    update((state) => {
                        state.history = loadedData;
                        return state;
                    });
                } else if(data.type === "remove_history") { // Remove history
                    let newState = [];
                    subscribe((state) => {
                        newState = state.history[0] === "EMPTY" ? [] : state.history;
                        newState = newState.filter((e) => e.id !== mainData);
                        if(newState.length === 0) {
                            newState = ["EMPTY"];
                        }
                    });
                    update((state) => {
                        state.history = newState;
                        return state;
                    });
                } else if(data.type === "clear_history") { // Clear history
                    update((state) => {
                        state.history = ["EMPTY"];
                        return state;
                    });
                } else if(data.type === "create_playlist") { // Create playlist
                    if(mainData !== "EXISTS") {
                        update((state) => {
                            state.playlist = state.playlist?.empty ? {} : state.playlist;
                            state.playlist[mainData] = ["EMPTY"];
                            return state;
                        });
                    } else {
                        update((state) => {
                            state.error = "Playlist already exists";
                            return state;
                        });
                    }
                } else if(data.type === "rename_playlist") { // Rename playlist
                    if(mainData !== "NONE") {
                        update((state) => {
                            state.playlist[mainData.new_name] = state.playlist[mainData.name];
                            delete state.playlist[mainData.name];
                            return state;
                        });
                    } else {
                        update((state) => {
                            state.error = "Playlist not found";
                            return state;
                        });
                    }
                } else if(data.type === "add_playlist") { // Add playlist
                    let newState = [];
                    subscribe((state) => {newState = state.playlist[mainData.name];});
                    newState = newState[0] === "EMPTY" ? [] : newState;
                    newState = newState.filter((e) => e.id !== mainData.id);
                    if(checkArrayInObject([mainData.id], $song.info)) {
                        newState.push($song.info[mainData.id]);
                    } else {
                        await song.info(mainData.id);
                        while(Object.keys($song.info).length === 0 || !checkArrayInObject([mainData.id], $song.info)) {
                            await new Promise((resolve) => setTimeout(resolve, 100));
                        }
                        newState.push($song.info[mainData.id]);
                    }
                    update((state) => {
                        state.playlist[mainData.name] = newState;
                        return state;
                    });
                } else if(data.type === "remove_playlist") { // Remove playlist
                    let newState = {};
                    subscribe((state) => {newState = state.playlist[mainData.name];});
                    newState = newState.filter((e) => e.id !== mainData.id);
                    newState = newState.length === 0 ? ["EMPTY"] : newState;
                    update((state) => {
                        state.playlist[mainData.name] = newState;
                        return state;
                    });
                } else if(data.type === "delete_playlist") { // Delete playlist
                    let newState = {};
                    subscribe((state) => {
                        newState = state.playlist?.empty ? {} : state.playlist;
                        delete newState[mainData];
                    });
                    if(Object.keys(newState).length === 0) {
                        newState = {empty: "EMPTY"};
                    }
                    update((state) => {
                        state.playlist = newState;
                        return state;
                    });
                }
            });
            socket.addEventListener("close", () => {
                console.log("[DB] Disconnected");
                console.log("[DB] Reconnecting in 2 seconds...");
                setTimeout(() => {
                    this.connect();
                }, 2000);
            });
            socket.addEventListener("error", (error) => {
                console.log("[DB] Error: ", error);
            });
        },
        async addHistory(id) {
            socket.send(JSON.stringify({type: "add_history", id: id}));
        },
        async removeHistory(id) {
            socket.send(JSON.stringify({type: "remove_history", id: id}));
        },
        async clearHistory() {
            socket.send(JSON.stringify({type: "clear_history"}));
        },
        async createPlaylist(name) {
            socket.send(JSON.stringify({type: "create_playlist", name: name}));
        },
        async renamePlaylist(name, newName) {
            socket.send(JSON.stringify({type: "rename_playlist", name: name, new_name: newName}));
        },
        async addPlaylist(name, id) {
            socket.send(JSON.stringify({type: "add_playlist", name: name, id: id}));
        },
        async removePlaylist(name, id) {
            socket.send(JSON.stringify({type: "remove_playlist", name: name, id: id}));
        },
        async deletePlaylist(name) {
            socket.send(JSON.stringify({type: "delete_playlist", name: name}));
        },
    }
}

export const db = DB();