<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { user } from "$lib/stores/user";
    import { db } from "$lib/websockets/db";
    import { song } from "$lib/websockets/song";
    import { ctxmenu } from "$lib/stores/ctxMenu";
    import CtxMenu from "$lib/components/CtxMenu.svelte";
    import Navbar from "$lib/components/Navbar.svelte";
    import SearchBox from "$lib/components/SearchBox.svelte";
    import Player from "$lib/components/Player.svelte";
    import { AppShell, LightSwitch, autoModeWatcher, storePopup, initializeStores, Modal, Toast, Drawer, getDrawerStore, getToastStore } from "@skeletonlabs/skeleton";
    import { computePosition, autoUpdate, offset, shift, flip, arrow } from "@floating-ui/dom";

    storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
    initializeStores();

    let active;
    $: active = $page.route.id.replace("/(app)", "");

    onMount(async() => {
        await user.load();
        await song.connect();
        if($user.id !== 0 && $user.id !== 1) {
            await db.connect();
        }
    });

    const drawerStore = getDrawerStore();
    function openDrawer() {
        drawerStore.open({
            bgBackdrop: "bg-surface-900/50",
            height: "h-[calc(100%-5rem)]",
            width: "w-72",
            padding: "p-4",
            rounded: "rounded-token"
        });
    }

    // Error
    const toastStore = getToastStore();
    $: if($db.error !== "")  {
        toastStore.trigger({message: $db.error});
        $db.error = "";
    } else if($song.error !== "") {
        toastStore.trigger({message: $song.error});
        $song.error = "";
    }
</script>

<svelte:head>
    {@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>

<svelte:window on:click={ctxmenu.hide} />

<CtxMenu />
<Modal regionBackdrop="bg-surface-900/60" regionBody="max-h-[30rem] overflow-auto" />
<Toast
    background="bg-surface-900"
    color="text-primary-50"
    buttonDismiss="bg-surface-50 text-primary-900 rounded-full btn-icon h-[1.80rem] w-[1.80rem]"
    spacing="gap-x-2"
    padding="p-3"
    zIndex="z-[100] mb-20"
/>
<AppShell class="h-full" slotSidebarLeft="h-[calc(100%-5rem)] z-[50] grid grid-cols-1" slotSidebarRight="grid grid-cols-1" slotPageContent="grid grid-cols-1">
    <svelte:fragment slot="sidebarLeft">
        <div class="flex">
            <div class="hidden lg:block h-full">
                <Navbar session={1} active={active} />
                <SearchBox />
            </div>
            <Drawer class="lg:hidden">
                <Navbar session={2} active={active} />
            </Drawer>
        </div>
    </svelte:fragment>
    <div class="flex flex-col w-full h-full items-center justify-center p-2 lg:p-5">
        <div class="flex justify-between items-center fixed top-0 right-0 left-0 px-5 py-4 z-[10] w-full bg-surface-100-800-token">
            <button on:click={openDrawer} class="hover:bg-surface-200/50 hover:dark:bg-surface-700/40 rounded-token p-3 duration-200 text-lg lg:invisible">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
            </button>
            <LightSwitch class="!ring-primary-500 z-[10]" fillLight="fill-surface-50" fillDark="!fill-surface-900" />
        </div>
        <div class="h-full w-full mt-20 mb-28 overflow-hidden">
            <slot />
        </div>
    </div>
    <svelte:fragment slot="footer">
        <Player />
    </svelte:fragment>
</AppShell>