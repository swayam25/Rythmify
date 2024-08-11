<script>
    import { song } from "$lib/websockets/song";
    import { box } from "$lib/stores/searchBox";
    import { onMount } from "svelte";

    $: searchQuery = "";
    $: searchTimeout = null;

    onMount(() => {
        document.addEventListener("keypress", (e) => {
            if(e.key === "/") {
                e.preventDefault();
                document.getElementById("search").focus();
            }
        });
    })
</script>

<div class="flex justify-between items-center bg-surface-700/40 w-full rounded-token">
    <input
        id="search"
        class="bg-transparent rounded-l-token text-base p-3 text-primary-50 w-full outline-none placeholder-primary-400"
        placeholder="Search for songs"
        bind:value={searchQuery}
        on:keypress={async(e) => {
            if(e.key !== "Escape") {
                box.openBox();
            }
            if(e.key === "Enter") {
                if(searchTimeout) {clearTimeout(searchTimeout);}
                await song.clearSearch();
                await song.search(searchQuery);
            } else {
                if(searchTimeout) {clearTimeout(searchTimeout);}
                searchTimeout = setTimeout(async() => {
                    await song.clearSearch();
                    await song.search(searchQuery);
                }, 800);
            }
        }}
        on:keyup={async(e) => {
            if(searchQuery === "" || searchQuery === " " || e.key === "Escape") {
                await song.clearSearch();
                box.closeBox();
            }
        }}
    />
    <button
        on:click={async() => {
            searchQuery = "";
            await song.clearSearch();
            box.closeBox();
        }}
        class="group p-3 flex justify-center items-center rounded-r-token transition-all"
        class:opacity-0={searchQuery === ""}
        class:opacity-100={searchQuery !== ""}
        disabled={searchQuery === ""}
    >
        <svg class="h-5 w-5 fill-primary-100 group-hover:fill-primary-400 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.72 5.72a.75.75 0 0 1 1.06 0L12 10.94l5.22-5.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L13.06 12l5.22 5.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L12 13.06l-5.22 5.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L10.94 12 5.72 6.78a.75.75 0 0 1 0-1.06Z" />
        </svg>
    </button>
</div>