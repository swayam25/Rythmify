<script>
    import { page } from "$app/stores";
    import config from "../../../config.json";
</script>

<svelte:head>
    <title>Rythmify | {$page.error.message}</title>
</svelte:head>

<div class="flex flex-col items-center justify-center h-screen gap-11">
    <img alt="Rythmify" src="/rythmify.webp" class="h-20 w-20" />
    <div class="flex gap-x-4 items-center justify-center">
        <h1 class="text-4xl lg:text-5xl font-bold">{$page.status}</h1>
        <h1 class="text-5xl lg:text-6xl text-primary-500-400-token font-thin">|</h1>
        <h1 class="text-4xl lg:text-5xl font-bold">{$page.error.message}</h1>
    </div>
    <div class="flex gap-5">
        <a href="/" class="bg-surface-700/40 hover:bg-surface-700/30 rounded-token p-3 duration-200 text-lg flex gap-x-2 transition-all hover:scale-110 items-center justify-center">
            <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
            </svg>
            Home
        </a>
        <a href="{config.server}/auth/login" class="bg-surface-700/40 hover:bg-surface-700/30 rounded-token p-3 duration-200 text-lg flex gap-x-2 transition-all hover:scale-110 items-center justify-center">
            <svg class="fill-primary-50 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
            </svg>
            Login
        </a>
    </div>
</div>