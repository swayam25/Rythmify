<script>
    import { fade } from "svelte/transition";
    import config from "../../../../../config.json";
    import { user } from "$lib/stores/user";
    import { db } from "$lib/websockets/db";
    import { player } from "$lib/stores/player";
    import { ctxmenu } from "$lib/stores/ctxMenu";

    $: history = $db.history.toReversed();
    $: userID = $user.id;
</script>

<svelte:head>
    <title>Rythmify | History</title>
</svelte:head>

<div>
    {#if (userID === 0 || history.length === 0) && !(userID === 1)}
        <div class="flex flex-col items-center justify-center w-full gap-2">
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
    {:else if userID === 1}
        <div class="flex flex-col items-center justify-center h-screen rm-bm">
            <a href="{config.server}/auth/login" class="bg-surface-200/50 dark:bg-surface-700/40 hover:bg-surface-200/40 hover:dark:bg-surface-700/30 rounded-token p-3 duration-200 text-2xl flex gap-x-2 items-center justify-center">
                <svg class="fill-token h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                </svg>
                Login
            </a>
        </div>
    {:else if history[0] === "EMPTY"}
        <div transition:fade class="flex flex-col items-center justify-center h-screen rm-bm">
            <h1 class="text-2xl font-bold">Your history is empty</h1>
        </div>
    {:else}
        <button on:click={async() => {await db.clearHistory();}} transition:fade class="bg-surface-900 rounded-token p-3 text-xl flex gap-2 justify-center items-center fixed bottom-28 right-5 group">
            <svg class="duration-200 h-5 lg:h-6 w-5 lg:w-6 fill-primary-50 group-hover:fill-error-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
            </svg>
            <span class="duration-200 text-base lg:text-xl text-primary-50 group-hover:text-error-500">Clear history</span>
        </button>
        <div transition:fade class="flex flex-col items-center justify-center w-full gap-2 transition-all">
            {#each history as song}
                <button
                    on:contextmenu|preventDefault={(e) => {ctxmenu.show(e, song.id)}}
                    transition:fade
                    class="p-3 rounded-token hover:bg-surface-200/50 hover:dark:bg-surface-700/40 hover:shadow-lg duration-200 flex gap-4 items-center justify-start w-full"
                >
                    <button on:click={async() => {await db.removeHistory(song.id);}} class="bg-surface-100-800-token font-semibold flex justify-center items-center p-2.5 lg:p-3 rounded-full group flex-shrink-0">
                        <svg class="h-3 lg:h-4 w-3 lg:w-4 fill-primary-500 dark:fill-primary-400 group-hover:fill-surface-900 group-hover:dark:fill-primary-50 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                        </svg>
                    </button>
                    <button on:click={async() => {await player.play(song.id, true);}} class="flex justify-between items-center w-full">
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