import { join } from "path";
import { skeleton } from "@skeletonlabs/tw-plugin";
import { rythmify } from "./rythmify";

/** @type {import("tailwindcss").Config} */
module.exports = {
    content: [
        "./src/**/*.{html,js,svelte,ts}",
        join(
            require.resolve("@skeletonlabs/skeleton"),
            "../**/*.{html,js,svelte,ts}"
        )
    ],
    darkMode: "class",
    theme: {},
    plugins: [
        require("tailwindcss"),
        require("autoprefixer"),
        skeleton({
            themes: {custom: [rythmify]}
        })
    ]
}