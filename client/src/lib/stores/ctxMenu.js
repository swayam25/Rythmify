import { writable } from "svelte/store";

function CtxMenu() {
    const { subscribe, set, update } = writable({
        pos: {x: 0, y: 0},
        browser: {h: 0, w: 0},
        menu: {h: 0, w: 0},
        songID: "",
        show: false,
        type: "song", // song | playlist
        plName: ""
    });

    return {
        subscribe, set, update,
        show(e, songID="", type="song", plName="") {
            update((data) => {
                data.show = true;
                data.songID = songID;
                data.type = type;
                data.plName = plName;
                data.browser = {
                    h: window.innerHeight,
                    w: window.innerWidth
                }
                data.pos = {
                    x: e.clientX,
                    y: e.clientY
                }
                if (data.browser.h -  data.pos.y < data.menu.h) {
                    data.pos.y = data.pos.y - data.menu.h
                }
                if (data.browser.w -  data.pos.x < data.menu.w) {
                    data.pos.x = data.pos.x - data.menu.w
                }
                return data;
            });
        },
        hide(e) {
            update((data) => {
                data.songID = 0;
                data.show = false;
                return data;
            });
        },
        getCtxDiemnsions(e) {
            update((data) => {
                data.menu = {
                    h: e.offsetHeight,
                    w: e.offsetWidth
                }
                return data;
            });
        }
    }
}

export const ctxmenu = CtxMenu();