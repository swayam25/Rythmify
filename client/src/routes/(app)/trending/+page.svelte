<script>
    import { fade } from "svelte/transition";
    import { player } from "$lib/stores/player";
    import { song } from "$lib/websockets/song";
    import { ctxmenu } from "$lib/stores/ctxMenu";

    $: trend = $song.trending;
</script>

<svelte:head>
    <title>Rythmify | Amplify your moments</title>
</svelte:head>

<div class="flex flex-wrap gap-4 transition-all items-center w-full justify-center">
    {#if trend.length === 0}
        {#each Array.from({ length: 20 }, (_, i) => i + 1) as i}
            <div class="flex flex-col rounded-token w-fit p-5 duration-200 items-center justify-center animate-pulse">
                <div class="h-32 lg:h-52 w-32 lg:w-52 rounded-token bg-surface-700/40" />
                <div class="mt-5">
                    <div class="h-5 w-32 rounded-token bg-surface-700/40" />
                    <div class="h-5 w-32 rounded-token bg-surface-700/40 mt-2" />
                </div>
            </div>
        {/each}
    {:else}
        {#each trend as song}
            <button
                on:contextmenu|preventDefault={(e) => {ctxmenu.show(e, song.id);}}
                on:click={async() => {await player.play(song.id, true);}}
                transition:fade
                class="hover:bg-surface-200/50 hover:dark:bg-surface-700/40 hover:shadow-lg flex flex-col rounded-token w-fit p-5 duration-200 items-center justify-center"
            >
                <img src={song.cover} alt={song.title} class="h-32 lg:h-52 w-32 lg:w-52 object-cover rounded-token" />
                <div class="mt-5 max-w-[8rem] overflow-hidden text-center">
                    <h1 title={song.title} class="text-base lg:text-lg font-bold truncate">{song.title}</h1>
                    <p title={song.artist} class="text-sm text-primary-500-400-token truncate">{song.artist}</p>
                </div>
            </button>
        {/each}
    {/if}
</div>