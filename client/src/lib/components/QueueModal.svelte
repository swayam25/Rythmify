<script>
    import { fade } from "svelte/transition";
    import { getModalStore } from "@skeletonlabs/skeleton";
    import { player } from "$lib/stores/player";

    export let parent;
    $: queue = $player.queue;
    const modalStore = getModalStore();

    function onClose() {
        if($modalStore[0].response) {$modalStore[0].response(false);}
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
    <div transition:fade class="modal-backdrop fixed top-0 left-0 right-0 bottom-0 overflow-y-auto {parent.regionBackdrop}">
        <div transition:fade class="modal-transition w-full h-fit min-h-full p-4 overflow-y-auto flex justify-center {parent.position}">
            <div class="modal {parent.background} block overflow-y-auto {parent.width} {parent.height} {parent.spacing} {parent.rounded} {parent.shadow} {parent.padding}">
                <header class="modal-header {parent.regionHeader}">Queue</header>
                {#if queue.length > 0}
                    <div transition:fade class="flex w-full h-fit items-center justify-between">
                        <button on:click={async() => {await player.clearQueue();}} class="bg-surface-200/50 dark:bg-surface-700/40 hover:bg-surface-200/40 hover:dark:bg-surface-700/30 rounded-token p-3 text-xl flex gap-2 justify-center items-center group">
                            <svg class="duration-200 h-6 w-6 group-hover:fill-error-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                            <span class="duration-200 group-hover:text-error-500">Clear queue</span>
                        </button>
                        <span class="text-primary-500-400-token font-bold">{queue.length} Song{queue.length > 1 ? "s" : ""}</span>
                    </div>
                {/if}
                <div transition:fade class="flex flex-col gap-y-2 items-center justify-center w-full">
                    {#if queue.length <= 0}
                        <p>Queue Is Empty</p>
                    {:else}
                        <div class="space-y-2 items-center justify-center w-full h-full {parent.regionBody}">
                            {#each queue as song}
                                <div transition:fade class="p-3 rounded-token {$player.current.meta.id === song.id ? "bg-surface-200/50 dark:bg-surface-700/40" : "hover:bg-surface-200/50 hover:dark:bg-surface-700/40"} duration-200 flex gap-4 items-center justify-start w-full">
                                    <button on:click={async() => {await player.removeQueue(song.id);}} class="bg-surface-100-800-token font-semibold flex justify-center items-center p-3 rounded-full group" disabled={$player.current.meta.id === song.id}>
                                        <svg class="h-4 w-4 {$player.current.meta.id === song.id ? "!fill-secondary-500" : "fill-primary-500 dark:fill-primary-400 group-hover:fill-surface-900 group-hover:dark:fill-primary-50"} duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                            {#if $player.current.meta.id === song.id}
                                                <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z" />
                                            {:else}
                                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                                            {/if}
                                        </svg>
                                    </button>
                                    <button on:click={async() => {await player.play(song.id, false, true);}} class="flex justify-between items-center gap-x-4 w-full" disabled={$player.current.meta.id === song.id}>
                                        <div class="flex justify-between items-center gap-x-2">
                                            <img class="w-16 h-16 rounded-token" src="{song.cover}" alt="{song.title}" />
                                            <div class="flex flex-col text-left justify-between max-w-[8rem] overflow-hidden">
                                                <h1 title={song.title} class="text-xl font-bold truncate">{song.title}</h1>
                                                <p title={song.artist} class="text-base text-primary-500-400-token truncate">{song.artist}</p>
                                            </div>
                                        </div>
                                        <p class="text-xl text-primary-500-400-token">{song.duration}</p>
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
                <footer class="modal-footer {parent.regionFooter}">
                    <button class="btn {parent.buttonNeutral}" on:click={onClose}>Close</button>
                </footer>
            </div>
        </div>
    </div>
{/if}