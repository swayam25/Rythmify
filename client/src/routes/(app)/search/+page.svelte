<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import SearchBar from "$lib/components/SearchBar.svelte";
    import SearchBox from "$lib/components/SearchBox.svelte";

    onMount(() => {
        if(window.innerWidth > 1024) {
            goto("/")
        }
        window.addEventListener("resize", () => {
            if(window.innerWidth > 1024) {
                goto("/")
            }
       });
    });
</script>

<svelte:head>
    <title>Rythmify | Search</title>
</svelte:head>

<div class="bg-surface-900 dark:bg-transparent rounded-token">
    <SearchBar />
</div>
<div class="mt-2">
    <SearchBox />
</div>
<div class="h-full w-full flex items-center justify-center">
    <div class="text-center flex flex-col items-center justify-center">
        <svg class="fill-primary-900 dark:fill-primary-50 h-12 w-12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
        <h1 class="text-2xl font-bold mt-5">Search for a song</h1>
        <p class="text-primary-500">To get started</p>
    </div>
</div>