<script>
    import { goto } from "$app/navigation";
    import { fade } from "svelte/transition";
    import config from "../../../../config.json";
    import { user } from "$lib/stores/user";
    import SearchBar from "./SearchBar.svelte";
    import { popup, getModalStore } from "@skeletonlabs/skeleton";

    export let active, session=1;

    const userPopup = {
        event: "click",
        target: "userPopup" + session.toString(),
        placement: "top"
    }

    const modalStore = getModalStore();
    function deleteAccModal() {
        const modal = {
            type: "confirm",
            title: "Are you sure you want to delete your account?",
            body: "This action is irreversible",
            response: (res) => {res ? goto(`${config.server}/auth/delete`) : null}
        }
        modalStore.trigger(modal);
    }
</script>

<nav class="bg-surface-900 top-0 left-0 text-primary-50 text-left flex flex-col items-center justify-between h-full w-72 p-5">
    <!-- Main Menu -->
    <div class="w-full">
        <!-- Search songs -->
        <div class="hidden lg:block">
            <SearchBar />
        </div>

        <!-- Select menu -->
        <div class="lg:mt-5 flex flex-col gap-2 w-full">
            <a href="/search" class="{active === "/search" ? "bg-surface-700/40" : ""} hover:bg-surface-700/40 rounded-token p-3 duration-200 text-lg lg:hidden flex gap-x-2 items-center">
                <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
                Search
            </a>
            <a href="/" class="{active === "" ? "bg-surface-700/40" : ""} hover:bg-surface-700/40 rounded-token p-3 duration-200 text-lg flex gap-x-2 items-center">
                <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                </svg>
                Home
            </a>
            <a href="/trending" class="{active === "/trending" ? "bg-surface-700/40" : ""} hover:bg-surface-700/40 rounded-token p-3 duration-200 text-lg flex gap-x-2 items-center">
                <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M1 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3zm5-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2z" />
                </svg>
                Trending
            </a>
            <a href="/history" class="{active === "/history" ? "bg-surface-700/40" : ""} hover:bg-surface-700/40 rounded-token p-3 duration-200 text-lg flex gap-x-2 items-center">
                <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z" />
                    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z" />
                    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z" />
                </svg>
                History
            </a>
            <a href="/playlist" class="{active.includes("/playlist") ? "bg-surface-700/40" : ""} hover:bg-surface-700/40 rounded-token p-3 duration-200 text-lg flex gap-x-2 items-center">
                <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z" />
                    <path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z" />
                    <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z" />
                </svg>
                Playlists
            </a>
        </div>
    </div>

    <!-- Settings -->
    <div class="w-full flex items-center justify-center">
        {#if $user.id === 0}
            <div class="flex gap-2 items-center animate-pulse justify-center">
                <div class="h-12 w-12 rounded-full bg-surface-700/40" />
                <div class="flex flex-col items-center justify-between">
                    <div class="h-5 w-32 rounded-token bg-surface-700/40" />
                    <div class="h-5 w-32 rounded-token bg-surface-700/40 mt-2" />
                </div>
            </div>
        {:else if $user.id === 1}
            <a href="{config.server}/auth/login" class="bg-surface-700/40 hover:bg-surface-700/30 flex items-center justify-center w-full rounded-token p-2 duration-200 text-lg gap-x-2">
                <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                </svg>
                Login
            </a>
        {:else}
            <!-- User Info -->
            <button use:popup={userPopup} transition:fade class="flex hover:bg-surface-700/40 rounded-token p-3 duration-200 gap-2 items-center justify-center">
                <img src={$user.avatar} alt={$user.name} class="h-12 w-12 rounded-full" />
                <div class="flex flex-col text-left justify-between overflow-hidden">
                    <p class="text-lg font-bold max-w-[8rem] truncate">{$user.name}</p>
                    <p class="text-primary-400 text-sm">{$user.id}</p>
                </div>
            </button>
            <!-- User Action Popup -->
            <div data-popup={"userPopup" + session.toString()}>
                <div class="bg-surface-700/40 rounded-md p-2 flex flex-col gap-2 items-center justify-between shadow-lg">
                    <a href="{config.server}/auth/logout" class="hover:bg-surface-700/40 flex w-full rounded-token p-3 duration-200 text-lg gap-2 items-center justify-center">
                        <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                        </svg>
                        Logout
                    </a>
                    <button on:click={deleteAccModal} class="hover:bg-surface-700/40 duration-200 group flex flex-col w-full rounded-token p-3 text-lg">
                        <div class="duration-200 flex gap-2 items-center justify-center group-hover:text-error-500">
                            <svg class="duration-200 h-5 w-5 fill-primary-50 group-hover:fill-error-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                            </svg>
                            Delete
                        </div>
                    </button>
                </div>
            </div>
        {/if}
    </div>
</nav>