<script>
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
    import { player } from "$lib/stores/player";
    import { popup, getModalStore, getToastStore } from "@skeletonlabs/skeleton";
    import RangeSlider from "svelte-range-slider-pips/src/RangeSlider.svelte"
    import QueueModal from "$lib/components/QueueModal.svelte";

    // Player Data
    $: isConnected = false;
    $: playerDisabled = $player.current.stream === "" || !isConnected || $player.loading;
    $: vol = [1];
    $: duration = 0;
    $: position = [0];
    $: loop = 0;
    $: shuffle = false;

    // Player
    onMount(async() => {
        isConnected = true;
    });

    // Player Funcs
    async function skip(mode) {
        position[0] = 0;
        await player.pause();
        await player.loading(true);
        if(loop === 1 || loop === 2) {
            if(loop === 1) {
                await player.current($player.current.index);
                await player.setSong($player.queue[$player.current.index].id);
            } else if(loop === 2) {
                if($player.current.index < ($player.queue.length - 1)) {
                    if(shuffle && Object.keys($player.queue).length > 1) {
                        await player.current(Math.floor(Math.random() * Object.keys($player.queue).length));
                    } else if(mode === 0) {
                        if($player.current.index + 1 < $player.queue.length) {
                            await player.current($player.current.index + 1);
                        } else {
                            await player.current(0);
                        }
                    } else if(mode === 1) {
                        if($player.current.index - 1 >= 0) {
                            await player.current($player.current.index - 1);
                        } else {
                            await player.current($player.queue.length - 1);
                        }
                    }
                } else {
                    await player.current(0);
                }
                await player.setSong($player.queue[$player.current.index].id);
            }
            await player.resume();
            await player.loading(false);
        } else if($player.current.index < ($player.queue.length - 1)) {
            if(mode === 0 && $player.queue.some((item) => item.id === $player.queue[$player.current.index + 1].id)) {
                await player.current($player.current.index + 1);
            } else if(mode === 1 && $player.queue.some((item) => item.id === $player.queue[$player.current.index - 1].id)) {
                await player.current($player.current.index - 1);
            }
            await player.setSong($player.queue[$player.current.index].id);
        } else {
            duration = 0;
            await player.clearQueue();
        }
    }

    async function toggleLoop() {
        if(loop === 0) {
            loop = 1;
        } else if(loop === 1 && $player.queue.length > 1) {
            loop = 2;
        } else {
            loop = 0;
        }
    }

    async function toggleShuffle() {
        shuffle = !shuffle;
    }

    // Volume
    const volumePopup = {
        event: "click",
        target: "volumePopup",
        placement: "top"
    }

    // More options for smaller screens
    const morePopup = {
        event: "click",
        target: "morePopup",
        placement: "top"
    }

    // Modal store
    const modalStore = getModalStore();

    // Lyrics
    async function showLyrics() {
        const lyrics = await player.getLyrics();
        if(lyrics != "NONE") {
            modalStore.trigger({
                type: "alert",
                title: `${$player.current.meta.title}'s Lyrics`,
                buttonTextCancel: "Close",
                body: lyrics
            });
        } else {
            modalStore.close();
        }
    }

    // Queue
    const toastStore = getToastStore();
    async function showQueue() {
        if($player.queue.length > 1) {
            modalStore.trigger({
                type: "component",
                component: {ref: QueueModal}
            })
        } else {
            toastStore.trigger({message: "Queue is empty"});
        }
    }

    // Screen
    $: isSmallScreen = true;
    onMount(() => {
        isSmallScreen = window.innerWidth <= 1024;
        window.addEventListener("resize", () => {
            isSmallScreen = window.innerWidth <= 1024;
        });
    });
</script>

<div class="text-primary-50 fixed bottom-0 h-20 w-full z-[80]">
    <audio
        src={$player.current.stream}
        bind:duration={duration}
        bind:currentTime={position[0]}
        bind:volume={vol[0]}
        bind:paused={$player.paused}
        on:loadedmetadata={async() => {await player.loading(false); await player.resume();}}
        on:ended={async() => {await skip(0);}}
    />

    <div class="bg-surface-900 w-full h-full">
        <div class="w-full fixed flex items-center justify-between ">
            <RangeSlider
                bind:values={position}
                springValues={{ stiffness: 0.17, damping: 1 }}
                min={0}
                max={duration}
                step={0.01}
                id="player"
                formatter={(value) => {
                    const minutes = Math.floor(value / 60);
                    const seconds = Math.floor(value % 60);
                    if(minutes > 60) {
                        const hours = Math.floor(minutes / 60);
                        return `${hours}:${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
                    }
                    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
                }}
                float={true}
                range="min"
                disabled={playerDisabled}
            />
        </div>
        <div class="flex w-full h-full justify-between items-center p-5 px-5 lg:px-20">
            <!-- Buttons -->
            <div class="flex gap-x-2 lg:gap-x-4 items-center justify-between">
                <!-- Skip Back -->
                <button on:click={async() => {await skip(1);}} title="Previous" class="duration-200" disabled={playerDisabled}>
                    <svg class="fill-primary-50 {playerDisabled ? "opacity-50" : "hover:fill-secondary-500"} h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V8.753l6.267 3.636c.54.313 1.233-.066 1.233-.697v-2.94l6.267 3.636c.54.314 1.233-.065 1.233-.696V4.308c0-.63-.693-1.01-1.233-.696L8.5 7.248v-2.94c0-.63-.692-1.01-1.233-.696L1 7.248V4a.5.5 0 0 0-.5-.5z" />
                    </svg>
                </button>
                <!-- Pause / Play -->
                <button on:click={async() => {$player.paused ? await player.resume() : await player.pause()}} title="{!$player.paused ? "Pause" : "Play"}" class="duration-200" disabled={playerDisabled}>
                    <svg class="fill-primary-50 {playerDisabled ? "opacity-50" : "hover:fill-secondary-500"} h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        {#if !$player.paused}
                            <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
                        {:else}
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                        {/if}
                    </svg>
                </button>
                <!-- Skip Forth -->
                <button on:click={async() => {await skip(0);}} title="Next" class="duration-200" disabled={playerDisabled}>
                    <svg class="fill-primary-50 {playerDisabled ? "opacity-50" : "hover:fill-secondary-500"} h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.753l-6.267 3.636c-.54.313-1.233-.066-1.233-.697v-2.94l-6.267 3.636C.693 12.703 0 12.324 0 11.693V4.308c0-.63.693-1.01 1.233-.696L7.5 7.248v-2.94c0-.63.693-1.01 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5z" />
                    </svg>
                </button>
            </div>
            <!-- Song Info -->
            {#if !isConnected || $player.loading}
                <div class="flex gap-x-2 items-center justify-center animate-pulse">
                    <div class="h-12 w-12 rounded-token bg-surface-700/40" />
                    <div class="flex flex-col">
                        <div class="h-5 w-32 lg:w-96 rounded-token bg-surface-700/40" />
                        <div class="h-5 w-32 lg:w-96 rounded-token bg-surface-700/40 mt-2" />
                    </div>
                </div>
            {:else if $player.current.stream !== ""}
                <div transition:fade class="flex gap-x-2 items-center justify-center">
                    <img src={$player.current.meta.cover} alt={$player.current.meta.title} class="h-11 lg:h-12 w-11 lg:w-12 rounded-token object-cover" />
                    <div class="flex flex-col justify-center overflow-hidden max-w-[8rem]">
                        <p title={$player.current.meta.title} class="text-sm lg:text-base font-semibold truncate">{$player.current.meta.title}</p>
                        <p title={$player.current.meta.artist} class="text-sm text-primary-400 truncate">{$player.current.meta.artist}</p>
                    </div>
                </div>
            {:else}
                <p class="text-sm lg:text-base font-semibold flex flex-col items-center justify-center">Nothing Is Being Played</p>
            {/if}
            <!-- Other Buttons -->
            <div class="flex gap-x-2 lg:gap-x-4 items-center justify-between">
                <!-- Volume -->
                <button use:popup={volumePopup} title="Volume" class="duration-200" disabled={playerDisabled}>
                    <svg class="fill-primary-50 {playerDisabled ? "opacity-50" : "hover:fill-secondary-500"} h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        {#if vol[0] === 0}
                            <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
                        {:else if vol[0] < 0.5}
                            <path d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12V4zm3.025 4a4.486 4.486 0 0 1-1.318 3.182L10 10.475A3.489 3.489 0 0 0 11.025 8 3.49 3.49 0 0 0 10 5.525l.707-.707A4.486 4.486 0 0 1 12.025 8z" />
                        {:else if vol[0] >= 0.10 && vol[0] < 0.50}
                            <path d="M9 4a.5.5 0 0 0-.812-.39L5.825 5.5H3.5A.5.5 0 0 0 3 6v4a.5.5 0 0 0 .5.5h2.325l2.363 1.89A.5.5 0 0 0 9 12V4zm3.025 4a4.486 4.486 0 0 1-1.318 3.182L10 10.475A3.489 3.489 0 0 0 11.025 8 3.49 3.49 0 0 0 10 5.525l.707-.707A4.486 4.486 0 0 1 12.025 8z" />
                        {:else if vol[0] >= 0.50}
                            <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
                            <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
                            <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" />
                        {/if}
                    </svg>
                </button>
                <div data-popup="volumePopup" class="bg-surface-900 w-32 rounded-token shadow-lg border-surface-900 border-x-[1rem]">
                    <div class="flex justify-center items-center m-3">
                        <RangeSlider
                            bind:values={vol}
                            springValues={{ stiffness: 0.17, damping: 1 }}
                            min={0}
                            max={1}
                            step={0.01}
                            id="vol"
                            formatter={(value) => {
                                return `${Math.round(value * 100)}%`;
                            }}
                            float={true}
                            range="min"
                            disabled={playerDisabled}
                        />
                    </div>
                </div>
                <!-- More -->
                <button use:popup={morePopup} title="More Options" class="lg:hidden duration-200" disabled={playerDisabled}>
                    <svg class="fill-primary-50 {playerDisabled ? "opacity-50" : "hover:fill-secondary-500"} h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3h9.05zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8h2.05zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1h9.05z" />
                    </svg>
                </button>
                <div data-popup={isSmallScreen ? "morePopup" : undefined} class="bg-surface-900 lg:bg-transparent rounded-token lg:!opacity-100" inert={isSmallScreen}>
                    <div class="m-2 lg:m-0 flex gap-x-2 lg:gap-x-4 items-center justify-between">
                        <!-- Loop -->
                        <button on:click={async() => {await toggleLoop()}} title="Loop" class="duration-200" disabled={playerDisabled}>
                            <svg class="fill-primary-50 {playerDisabled ? "opacity-50" : (loop === 1 || loop === 2 ? "!fill-secondary-500" : "") + " hover:fill-secondary-500"} h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                {#if loop === 0 || loop === 2}
                                    <path d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192Zm3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z" />
                                {:else}
                                    <path d="M11 4v1.466a.25.25 0 0 0 .41.192l2.36-1.966a.25.25 0 0 0 0-.384l-2.36-1.966a.25.25 0 0 0-.41.192V3H5a5 5 0 0 0-4.48 7.223.5.5 0 0 0 .896-.446A4 4 0 0 1 5 4h6Zm4.48 1.777a.5.5 0 0 0-.896.446A4 4 0 0 1 11 12H5.001v-1.466a.25.25 0 0 0-.41-.192l-2.36 1.966a.25.25 0 0 0 0 .384l2.36 1.966a.25.25 0 0 0 .41-.192V13h6a5 5 0 0 0 4.48-7.223Z" />
                                    <path d="M9 5.5a.5.5 0 0 0-.854-.354l-1.75 1.75a.5.5 0 1 0 .708.708L8 6.707V10.5a.5.5 0 0 0 1 0v-5Z" />
                                {/if}
                            </svg>
                        </button>
                        <!-- Shuffle -->
                        <button on:click={async() => {await toggleShuffle()}} title="Shuffle" class="duration-200" disabled={playerDisabled || $player.queue.length <= 1}>
                            <svg class="fill-primary-50 {playerDisabled || $player.queue.length <= 1 ? "opacity-50" : (shuffle ? "!fill-secondary-500" : "") + " hover:fill-secondary-500"} h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z" />
                                <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z" />
                            </svg>
                        </button>
                        <!-- Queue -->
                        <button on:click={async() => {await showQueue();}} title="Queue" class="duration-200" disabled={playerDisabled}>
                            <svg class="fill-primary-50 {playerDisabled ? "opacity-50" : "hover:fill-secondary-500"} h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM11 6.64v1.75l-2 .5v3.61c0 .495-.301.883-.662 1.123C7.974 13.866 7.499 14 7 14c-.5 0-.974-.134-1.338-.377-.36-.24-.662-.628-.662-1.123s.301-.883.662-1.123C6.026 11.134 6.501 11 7 11c.356 0 .7.068 1 .196V6.89a1 1 0 0 1 .757-.97l1-.25A1 1 0 0 1 11 6.64z" />
                            </svg>
                        </button>
                        <!-- Lyrics -->
                        <button on:click={async() => {await showLyrics();}} title="Lyrics" class="duration-200" disabled={playerDisabled}>
                            <svg class="fill-primary-50 {playerDisabled ? "opacity-50" : "hover:fill-secondary-500"} h-5 lg:h-6 w-5 lg:w-6 duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2z" />
                                <path fill-rule="evenodd" d="M12 3v10h-1V3h1z" />
                                <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1V2.82z" />
                                <path fill-rule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>