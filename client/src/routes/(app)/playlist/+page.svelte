<script>
    import { fade } from "svelte/transition";
    import config from "../../../../../config.json";
    import { user } from "$lib/stores/user";
    import { db } from "$lib/websockets/db";
    import { ctxmenu } from "$lib/stores/ctxMenu";
    import { getModalStore } from "@skeletonlabs/skeleton";

    $: playlist = $db.playlist;
    $: plKeys = Object.keys(playlist);
    $: userID = $user.id;

    // Create Playlist
    const modalStore = getModalStore();
    function createPlaylistModal() {
        const modal = {
            type: "prompt",
            title: "Create Playlist",
            body: "Enter the name of the playlist",
            valueAttr: {type: "text", minlength: 2, maxlength: 20, required: true},
            buttonTextSubmit: "Create",
            response: (res) => {res ? db.createPlaylist(res) : null}
        }
        modalStore.trigger(modal);
    }
</script>

<svelte:head>
    <title>Rythmify | Playlist</title>
</svelte:head>

<div>
    {#if (userID === 0 || plKeys.length === 0) && !(userID === 1)}
        <div class="flex flex-wrap gap-4 transition-all items-center w-full justify-center">
            {#each Array.from({ length: 20 }, (_, i) => i + 1) as i}
                <div class="flex flex-col rounded-token w-fit p-5 duration-200 items-center justify-center animate-pulse">
                    <div class="h-32 lg:h-52 w-32 lg:w-52 rounded-token bg-surface-700/40" />
                    <div class="mt-5">
                        <div class="h-5 w-32 rounded-token bg-surface-700/40" />
                        <div class="h-5 w-32 rounded-token bg-surface-700/40 mt-2" />
                    </div>
                </div>
            {/each}
        </div>
    {:else if userID === 1}
        <div class="flex flex-col items-center justify-center h-screen rm-bm">
            <a href="{config.server}/auth/login" class="bg-surface-200/50 dark:bg-surface-700/40 hover:bg-surface-200/40 hover:dark:bg-surface-700/30 rounded-token p-3 duration-200 text-2xl flex gap-2 items-center justify-center">
                <svg class="fill-token h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                </svg>
                Login
            </a>
        </div>
    {:else}
        <button on:click={createPlaylistModal} transition:fade class="bg-surface-900 rounded-token p-3 text-xl flex gap-2 justify-center items-center fixed bottom-28 right-5 group">
            <svg class="duration-200 h-5 lg:h-6 w-5 lg:w-6 fill-primary-50 group-hover:fill-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
            </svg>
            <span class="duration-200 text-base lg:text-xl text-primary-50 group-hover:text-primary-400">Create Playlist</span>
        </button>
        {#if playlist?.empty}
            <div transition:fade class="flex flex-col items-center justify-center h-screen rm-bm">
                <h1 class="text-2xl font-bold">No Playlists</h1>
            </div>
        {:else}
            <div transition:fade class="flex flex-wrap gap-4 transition-all items-center w-full justify-center">
                {#each plKeys.toReversed() as pl}
                    <a
                        on:contextmenu|preventDefault={(e) => {
                            ctxmenu.show(e, "", "playlist", pl);
                        }}
                        href="/playlist/{pl}"
                        class="hover:bg-surface-200/50 hover:dark:bg-surface-700/40 duration-200 p-5 hover:shadow-lg rounded-token w-fit flex flex-col items-center justify-center"
                    >
                        {#if playlist[pl][0] === "EMPTY"}
                            <div class="h-32 lg:h-52 w-32 lg:w-52 rounded-token bg-surface-700/40" />
                        {:else}
                            <img src={playlist[pl][playlist[pl].length - 1].cover} alt={pl} class="h-32 lg:h-52 w-32 lg:w-52 object-cover rounded-token" />
                        {/if}
                        <div class="mt-5 max-w-[8rem] overflow-hidden text-center">
                            <h1 title={pl} class="text-base lg:text-lg font-bold truncate">{pl}</h1>
                            {#if playlist[pl][0] === "EMPTY"}
                                <p class="text-sm text-primary-500-400-token truncate">0 Song</p>
                            {:else}
                                <p class="text-sm text-primary-500-400-token truncate">{playlist[pl].length} Song{playlist[pl].length > 1 ? "s" : ""}</p>
                            {/if}
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    {/if}
</div>