import config from "../../../../config.json";
import { writable } from "svelte/store";

function User() {
    const { subscribe, set, update } = writable({
        id: 0,
        name: "",
        avatar: ""
    });

    return {
        subscribe,
        async load() {
            try {
                const data = await fetch(`${config.server}/auth/user`, {credentials: "include"}).then((res) => res.json());
                update((user) => {
                    user.id = data.id;
                    user.name = data.name;
                    user.avatar = data.avatar;
                    return user;
                });
            } catch {
                update((user) => {
                    user.id = 1;
                    user.name = "";
                    user.avatar = "";
                    return user;
                });
            }
        }
    }
}

export const user = User();