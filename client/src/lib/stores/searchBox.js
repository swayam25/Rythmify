import { writable } from "svelte/store";

function Box() {
    const { subscribe, set, update } = writable(false);
    return {
        subscribe, set, update,
        openBox() {
            update((data) => {
                data = true;
                return data;
            });
        },
        closeBox() {
            update((data) => {
                data = false;
                return data;
            });
        }
    }
}

export const box = Box();