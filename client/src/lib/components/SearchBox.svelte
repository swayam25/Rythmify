<script>
    import { fade } from "svelte/transition";
    import { song } from "$lib/websockets/song";
    import { box } from "$lib/stores/searchBox";
    import { player } from "$lib/stores/player";
    import { ctxmenu } from "$lib/stores/ctxMenu";

    $: searchBox = $box;
    $: searchResults = $song.search;
</script>

<div class="-mx-2 lg:m-0 lg:h-[calc(100%-5rem)] w-full lg:w-0 {searchBox ? "h-[calc(100%-15rem)] lg:w-96" : "h-0"} lg:top-0 lg:left-72 absolute bg-surface-100-800-token lg:shadow-lg transition-all overflow-auto" class:p-5={searchBox}>
    <div class="flex flex-col items-center justify-start gap-2">
        {#if searchBox && searchResults.length === 0}
            {#each Array.from({ length: 20 }, (_, i) => i + 1) as i}
                <div class="flex gap-x-2 items-center w-full justify-between p-3 rounded-token duration-200 animate-pulse">
                    <div class="flex items-center justify-start gap-x-2">
                        <div class="h-12 w-12 rounded-token bg-surface-700/40" />
                        <div class="flex flex-col items-center justify-start">
                            <div class="h-5 w-48 rounded-token bg-surface-700/40" />
                            <div class="h-5 w-48 rounded-token bg-surface-700/40 mt-2" />
                        </div>
                    </div>
                    <div class="h-5 w-10 rounded-token bg-surface-700/40" />
                </div>
            {/each}
        {:else}
            {#each searchResults as song}
                <button
                    on:contextmenu|preventDefault={(e) => {ctxmenu.show(e, song.id);}}
                    on:click={async() => {await player.play(song.id, true);}}
                    transition:fade
                    class="w-full flex gap-x-2 items-center justify-between hover:bg-surface-200/50 hover:dark:bg-surface-700/40 p-3 rounded-token duration-200"
                >
                    <div class="flex items-center justify-start gap-x-2">
                        <img src={song.cover} alt={song.title} class="h-12 w-12 rounded-token object-cover" />
                        <div class="flex flex-col text-left justify-center max-w-[8rem] overflow-hidden">
                            <p title={song.title} class="text-base font-semibold truncate">{song.title}</p>
                            <p title={song.artist} class="text-sm text-primary-500-400-token truncate">{song.artist}</p>
                        </div>
                    </div>
                    <p class="text-base font-semibold text-primary-500-400-token">{song.duration}</p>
                </button>
            {/each}
        {/if}
    </div>
</div>