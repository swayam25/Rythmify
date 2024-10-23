<script>
    import { goto } from "$app/navigation";
    import { fade } from "svelte/transition";
    import { user } from "$lib/stores/user";
    import { page } from "$app/stores";
    import { db } from "$lib/websockets/db";
    import { player } from "$lib/stores/player";
    import { ctxmenu } from "$lib/stores/ctxMenu";
    import { getModalStore } from "@skeletonlabs/skeleton";

    $: name = $page.params.name;
    $: songs = Object.keys($db.playlist).length === 0 ? null : $db.playlist[name] === undefined ? undefined : $db.playlist[name].toReversed();
    $: userID = $user.id;

    // Duration
    function calculateTotalDuration(durationsList) {
        function durationToSeconds(duration) {
            const [minutes, seconds] = duration.split(":").map(Number);
            return minutes * 60 + seconds;
        }
        const totalSeconds = durationsList.reduce((acc, curr) => acc + durationToSeconds(curr.duration), 0);
        function formatDuration(totalSeconds) {
            const minutes = Math.floor(totalSeconds / 60);
            if (minutes < 60) {
                return `${minutes} minutes`;
            } else {
                const hours = Math.floor(minutes / 60);
                const remainingMinutes = minutes % 60;
                return `${hours} hours ${remainingMinutes} minutes`;
            }
        }
        return formatDuration(totalSeconds);
    }

    // Modal Store
    const modalStore = getModalStore();

    // Rename playlist modal
    $: rename = "";
    async function renamePlaylistModal() {
        const modal = {
            type: "prompt",
            title: "Rename Playlist",
            body: "Enter a new name for the playlist",
            value: name,
            valueAttr: {type: "text", minlength: 2, maxlength: 20, required: true},
            buttonTextSubmit: "Rename",
            response: (res) => {
                if(res) {
                    db.renamePlaylist(name, res);
                    rename = res;
                } else {
                    null
                }
            }
        }
        modalStore.trigger(modal);
    }

    // Delete playlist modal
    function deletePlaylistModal() {
        const modal = {
            type: "confirm",
            title: "Delete Playlist",
            body: `Are you sure you want to delete "<span class="font-bold">${name}</span>"?`,
            buttonTextSubmit: "Delete",
            response: (res) => {res ? db.deletePlaylist(name) : null}
        }
        modalStore.trigger(modal);
    }

    // Playlist not found
    $: {
        if(rename != ""  && songs === undefined) {
            goto(`/playlist/${rename}`);
            rename = "";
        } else if(userID === 1 || songs === undefined) {
            goto("/playlist");
        }
    }
</script>

<svelte:head>
    <title>Rythmify | {name}</title>
</svelte:head>

<div class="flex flex-col">
    {#if (userID === 0 || songs === null || songs === undefined) && !(userID === 1)}
        <div class="w-full h-full flex items-center justify-start gap-4 sticky top-0 p-5 animate-pulse">
            <div class="h-32 lg:h-40 w-32 lg:w-40 rounded-token bg-surface-700/40 flex-shrink-0" />
            <div class="flex flex-col items-start justify-center">
                <div class="h-5 w-32 rounded-token bg-surface-700/40" />
                <div class="h-5 w-32 rounded-token bg-surface-700/40 mt-2" />
                <div class="mt-11 flex gap-x-2 items-center justify-center">
                    <div class="rounded-full h-9 lg:h-10 w-9 lg:w-10 bg-surface-700/40" />
                    <div class="rounded-full h-9 lg:h-10 w-9 lg:w-10 bg-surface-700/40" />
                    <div class="rounded-full h-9 lg:h-10 w-9 lg:w-10 bg-surface-700/40" />
                    <div class="h-5 w-32 rounded-token bg-surface-700/40" />
                </div>
            </div>
        </div>

        <hr class="mt-5 h-0.5 !bg-surface-200/50 dark:!bg-surface-700/40 !border-0 rounded-token" />

        <div class="flex flex-col items-center justify-center w-full mt-5 lg:mt-11">
            <div transition:fade class="flex flex-col items-center justify-center w-full gap-2 transition-all">
                {#each Array.from({ length: 20 }, (_, i) => i + 1) as i}
                    <div class="p-3 rounded-token duration-200 flex gap-4 items-center justify-start w-full animate-pulse">
                        <div class="bg-surface-700/40 rounded-full h-9 lg:h-10 w-9 lg:w-10 flex-shrink-0" />
                        <div class="flex justify-between items-center w-full">
                            <div class="flex justify-center items-center gap-x-2">
                                <div class="h-16 w-16 rounded-token bg-surface-700/40" />
                                <div class="flex flex-col items-center justify-center gap-2">
                                    <div class="h-5 w-28 lg:w-32 rounded-token bg-surface-700/40" />
                                    <div class="h-5 w-28 lg:w-32 rounded-token bg-surface-700/40" />
                                </div>
                            </div>
                            <div class="h-5 w-10 lg:w-14 rounded-token bg-surface-700/40" />
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <div class="w-full h-full flex items-center justify-start gap-4 sticky top-0 p-5">
            {#if songs[0] === "EMPTY"}
                <div class="h-32 lg:h-40 w-32 lg:w-40 rounded-token bg-surface-700/40" />
            {:else}
                <img src={songs[0].cover} alt={name} class="h-32 lg:h-40 w-32 lg:w-40 object-cover rounded-token" />
            {/if}
            <div class="flex flex-col items-start justify-center">
                <p class="text-2xl lg:text-5xl font-bold">
                    {name}
                </p>
                <p class="text-primary-500-400-token text-base lg:text-xl">
                    {#if songs[0] === "EMPTY"}
                        0 Song
                    {:else}
                        {songs.length} Song{songs.length > 1 ? "s" : ""}
                    {/if}
                </p>
                <div class="mt-11 flex gap-x-2 items-center justify-center">
                    <button
                        on:click={deletePlaylistModal}
                        title="Delete Playlist"
                        class="bg-secondary-500 rounded-full p-2 hover:scale-110 transition-all"
                    >
                        <svg class="fill-surface-50 dark:fill-surface-900 h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                        </svg>
                    </button>
                    <button
                        on:click={renamePlaylistModal}
                        title="Rename Playlist"
                        class="bg-secondary-500 rounded-full p-2 hover:scale-110 transition-all"
                    >
                        <svg class="fill-surface-50 dark:fill-surface-900 h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path fill-rule="evenodd" d="M17.263 2.177a1.75 1.75 0 0 1 2.474 0l2.586 2.586a1.75 1.75 0 0 1 0 2.474L19.53 10.03l-.012.013L8.69 20.378a1.753 1.753 0 0 1-.699.409l-5.523 1.68a.748.748 0 0 1-.747-.188.748.748 0 0 1-.188-.747l1.673-5.5a1.75 1.75 0 0 1 .466-.756L14.476 4.963ZM4.708 16.361a.26.26 0 0 0-.067.108l-1.264 4.154 4.177-1.271a.253.253 0 0 0 .1-.059l10.273-9.806-2.94-2.939-10.279 9.813ZM19 8.44l2.263-2.262a.25.25 0 0 0 0-.354l-2.586-2.586a.25.25 0 0 0-.354 0L16.061 5.5Z" />
                        </svg>
                    </button>
                    {#if songs[0] !== "EMPTY"}
                        <button
                            on:click={async() => {
                                if($player.playlist !== name) {
                                    let ids = [];
                                    await player.clearQueue();
                                    await player.play(songs[0].id, true);
                                    for (let i = 0; i < songs.length; i++) {
                                        ids.push(songs[i].id);
                                    }
                                    await player.addMassQueue(ids);
                                    await player.setPlaylist(name);
                                } else {
                                    $player.paused ? await player.resume() : await player.pause();
                                }
                            }}
                            title={$player.playlist !== name ? "Play" : $player.paused ? "Resume" : "Pause"}
                            class="bg-secondary-500 rounded-full p-2 hover:scale-110 transition-all"
                        >
                            <svg class="fill-surface-50 dark:fill-surface-900 h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                {#if !$player.paused && $player.playlist === name}
                                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                                {:else}
                                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                                {/if}
                            </svg>
                        </button>
                        <p class="text-primary-500-400-token text-base lg:text-xl">
                            {calculateTotalDuration(songs)}
                        </p>
                    {/if}
                </div>
            </div>
        </div>

        <hr class="mt-5 h-0.5 !bg-surface-200/50 dark:!bg-surface-700/40 !border-0 rounded-token" />

        <div class="flex flex-col items-center justify-center w-full mt-5 lg:mt-11">
            {#if songs[0] === "EMPTY"}
                <div class="flex flex-col items-center justify-center">
                    <h1 class="text-2xl font-bold">No Songs</h1>
                </div>
            {:else}
                <div transition:fade class="flex flex-col items-center justify-center w-full gap-2 transition-all">
                    {#each songs as song}
                        <button
                            on:contextmenu|preventDefault={(e) => {ctxmenu.show(e, song.id)}}
                            transition:fade
                            class="p-3 rounded-token {$player.current.meta.id === song.id && $player.playlist === name ? "bg-surface-200/50 dark:bg-surface-700/40" : "hover:bg-surface-200/50 hover:dark:bg-surface-700/40"} hover:shadow-lg duration-200 flex gap-4 items-center justify-start w-full"
                        >
                            <button on:click={async() => {await db.removePlaylist(name, song.id);}} class="bg-surface-100-800-token font-semibold flex justify-center items-center p-2.5 lg:p-3 rounded-full group flex-shrink-0" disabled={$player.current.meta.id === song.id && $player.playlist === name}>
                                <svg class="h-3 lg:h-4 w-3 lg:w-4 {$player.current.meta.id === song.id && $player.playlist === name ? "!fill-secondary-500" : "fill-primary-500 dark:fill-primary-400 group-hover:fill-surface-900 group-hover:dark:fill-primary-50"} duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    {#if $player.current.meta.id === song.id && $player.playlist === name}
                                        <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z" />
                                    {:else}
                                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                                    {/if}
                                </svg>
                            </button>
                            <button on:click={async() => {await player.play(song.id, true); await player.setPlaylist(name);}} class="flex justify-between items-center w-full">
                                <div class="flex justify-center items-center gap-x-2">
                                    <img class="h-14 lg:h-16 w-14 lg:w-16 rounded-token" src="{song.cover}" alt="{song.title}" />
                                    <div class="flex flex-col text-left justify-center max-w-[8rem] lg:max-w-[16rem] overflow-hidden">
                                        <p title={song.title} class="text-base lg:text-xl font-bold block truncate">{song.title}</p>
                                        <p title={song.artist} class="text-sm lg:text-base text-primary-500-400-token truncate">{song.artist}</p>
                                    </div>
                                </div>
                                <p class="text-base lg:text-xl text-primary-500-400-token">{song.duration}</p>
                            </button>
                        </button>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>