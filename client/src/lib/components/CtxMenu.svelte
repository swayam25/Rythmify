<script>
    import { fade } from "svelte/transition";
    import { user } from "$lib/stores/user";
    import { player } from "$lib/stores/player";
    import { ctxmenu } from "$lib/stores/ctxMenu";
    import { db } from "$lib/websockets/db";
    import { getModalStore } from "@skeletonlabs/skeleton";

    $: userID = $user.id;
    $: pos = $ctxmenu.pos;
    $: songID = $ctxmenu.songID;
    $: show = $ctxmenu.show;
    $: type = $ctxmenu.type;
    $: plName = $ctxmenu.plName;

    // Playlist list
    $: pls = $db.playlist;
    $: plKeys = Object.keys($db.playlist);
    $: plShow = !show;

    // Modal Store
    const modalStore = getModalStore();

    // Rename playlist modal
    function renamePlaylistModal() {
        const modal = {
            type: "prompt",
            title: "Rename Playlist",
            body: "Enter a new name for the playlist",
            value: plName,
            valueAttr: {type: "text", minlength: 2, maxlength: 20, required: true},
            buttonTextSubmit: "Rename",
            response: (res) => {res ? db.renamePlaylist(plName, res) : null}
        }
        modalStore.trigger(modal);
    }

    // Delete playlist modal
    function deletePlaylistModal() {
        const modal = {
            type: "confirm",
            title: "Delete Playlist",
            body: `Are you sure you want to delete "<span class="font-bold">${plName}</span>"?`,
            buttonTextSubmit: "Delete",
            response: (res) => {res ? db.deletePlaylist(plName) : null}
        }
        modalStore.trigger(modal);
    }
</script>

{#if show}
    <div
        transition:fade
        use:ctxmenu.getCtxDiemnsions
        style="top: {pos.y}px; left: {pos.x}px;"
        class="absolute z-[100] shadow-lg flex flex-col justify-center items-center {plShow ? "h-64 w-64" : "h-44 w-52"} transition-all ease-in-out"
    >
        <div transition:fade class="absolute p-3 rounded-token bg-surface-900 m-2 text-base {plShow ? "" : "hidden"} h-full w-full">
            <div class="fixed flex justify-between items-center">
                <div class="flex justify-center items-center gap-x-2">
                    <button
                        on:click|stopPropagation={() => {plShow = !plShow;}}
                        class="group"
                    >
                        <svg class="duration-200 h-5 lg:h-6 w-5 lg:w-6 fill-primary-50 group-hover:fill-primary-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5" />
                        </svg>
                    </button>
                    Playlists
                </div>
            </div>
            {#if plKeys.length === 0}
                <div class="pt-8 w-full h-full">
                    <ul transition:fade class="flex flex-col gap-2 items-center justify-start w-full h-full transition-all overflow-auto">
                        {#each Array.from({ length: 20 }, (_, i) => i + 1) as i}
                            <button class="rounded-token flex gap-x-2 items-center justify-start w-full animate-pulse p-3">
                                <div class="h-10 w-10 flex-shrink-0 rounded-token bg-surface-700/40" />
                                <div class="h-5 w-full rounded-token bg-surface-700/40" />
                            </button>
                        {/each}
                    </ul>
                </div>
            {:else if pls.empty}
                <div transition:fade class="h-full w-full flex items-center justify-center">
                    No Playlists
                </div>
            {:else}
                <div class="pt-8 w-full h-full">
                    <ul class="flex flex-col gap-2 items-center justify-start w-full h-full text-primary-50 overflow-auto">
                        {#each plKeys.toReversed() as pl}
                            <button transition:fade on:click={async() => {await db.addPlaylist(pl, songID);}} class="hover:bg-surface-700/40 p-3 duration-200 rounded-token flex gap-x-2 text-base items-center justify-start w-full">
                                {#if pls[pl][0] === "EMPTY"}
                                    <div class="h-10 w-10 flex-shrink-0 rounded-token bg-surface-700/40" />
                                {:else}
                                    <img src={pls[pl][pls[pl].length - 1].cover} alt={pl} class="h-10 w-10 object-cover rounded-token" />
                                {/if}
                                <p title={pl} class="truncate">{pl}</p>
                            </button>
                        {/each}
                    </ul>
                </div>
            {/if}
        </div>
        <div class="p-3 rounded-token bg-surface-900">
            <ul class="flex flex-col gap-2 items-center justify-start w-full text-primary-50">
                {#if type === "song"}
                    <button on:click={async() => {await player.play(songID, true);}} class="hover:hover:bg-surface-700/40 p-3 duration-200 rounded-token flex gap-x-2 text-base items-center justify-start w-full">
                        <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                        </svg>
                        Play
                    </button>
                    <button on:click={async() => {await player.play(songID);}} class="hover:hover:bg-surface-700/40 p-3 duration-200 rounded-token flex gap-x-2 text-base items-center justify-start w-full">
                        <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                        </svg>
                        Add To Queue
                    </button>
                    {#if userID === 0}
                        <div class="transition-all flex gap-x-2 text-base items-center justify-start w-full p-3 animate-pulse">
                            <div class="h-8 w-8 rounded-token bg-surface-700/40" />
                            <div class="h-5 w-24 rounded-token bg-surface-700/40" />
                        </div>
                    {:else if userID !== 1}
                        <button transition:fade on:click|stopPropagation={() => {plShow = !plShow;}} class="hover:hover:bg-surface-700/40 p-3 duration-200 rounded-token flex gap-x-2 text-base items-center justify-start w-full">
                            <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z" />
                                <path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z" />
                                <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
                            </svg>
                            Add To Playlist
                        </button>
                    {/if}
                {:else if type === "playlist"}
                    {#if pls[plName][0] !== "EMPTY"}
                        <button
                            on:click={async() => {
                                let ids = [];
                                await player.clearQueue();
                                await player.play(pls[plName][pls[plName].length - 1].id, true);
                                for (let i = (pls[plName].length - 1); i >= 0; i--) {
                                    ids.push(pls[plName][i].id);
                                }
                                await player.addMassQueue(ids);
                                await player.setPlaylist(plName);
                            }}
                            class="hover:hover:bg-surface-700/40 p-3 duration-200 rounded-token flex gap-x-2 text-base items-center justify-start w-full"
                        >
                            <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                            </svg>
                            Play
                        </button>
                    {/if}
                    <button on:click={renamePlaylistModal} class="hover:hover:bg-surface-700/40 p-3 duration-200 rounded-token flex gap-x-2 text-base items-center justify-start w-full">
                        <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M17.263 2.177a1.75 1.75 0 0 1 2.474 0l2.586 2.586a1.75 1.75 0 0 1 0 2.474L19.53 10.03l-.012.013L8.69 20.378a1.753 1.753 0 0 1-.699.409l-5.523 1.68a.748.748 0 0 1-.747-.188.748.748 0 0 1-.188-.747l1.673-5.5a1.75 1.75 0 0 1 .466-.756L14.476 4.963ZM4.708 16.361a.26.26 0 0 0-.067.108l-1.264 4.154 4.177-1.271a.253.253 0 0 0 .1-.059l10.273-9.806-2.94-2.939-10.279 9.813ZM19 8.44l2.263-2.262a.25.25 0 0 0 0-.354l-2.586-2.586a.25.25 0 0 0-.354 0L16.061 5.5Z" />
                        </svg>
                        Rename
                    </button>
                    <button on:click={deletePlaylistModal} class="hover:hover:bg-surface-700/40 p-3 rounded-token group flex gap-x-2 text-base items-center justify-start w-full">
                        <svg class="duration-200 fill-primary-50 group-hover:fill-error-500 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>
                        <span class="duration-200 group-hover:text-error-500">Delete</span>
                    </button>
                {/if}
            </ul>
        </div>
    </div>
{/if}