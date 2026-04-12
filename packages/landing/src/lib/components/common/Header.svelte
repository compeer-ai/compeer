<script lang='ts'>
    import Logo from "./Logo.svelte";
    import classNames from "classnames";
    import { page } from "$app/state";
	import Github from "../icons/Github.svelte";
	import Discord from "../icons/Discord.svelte";
	import Icon from "./Icon.svelte";
	import { Menu } from "@lucide/svelte";
	import { dispatcher } from "$lib/utilities/dispatcher";
	import { goto } from "$app/navigation";

    function isActive(prefix: string) {
        return page.url.pathname.startsWith(prefix);
    }

    const pages = [
        {
            name: "Docs",
            prefix: `/docs`,
            path: `/docs/quickstart`,
        },
        {
            name: "Changelog",
            prefix: `/changelog`,
            path: `/changelog`,
        },
        {
            name: "Blog",
            prefix: `/blog`,
            path: `/blog`,
        },
        {
            name: "Cookbook",
            prefix: `/cookbook`,
            path: `/cookbook`,
        },
    ];
</script>

{#snippet drawerContent()}
    <div class="px-7 flex flex-col space-y-3 text-black font-medium">
        {#each pages as page}
            <button onclick={async () => {
                await goto(page.path);
                dispatcher.clear('drawer');
            }} class='text-left'>
                <span>{page.name}</span>
            </button>
        {/each}
    </div>
{/snippet}
<nav class='w-full border-b border-gray-300 bg-white space-x-10'>
    <div class="mx-auto flex w-full max-w-6xl items-center px-7 md:py-0 py-7">
        <a href='/'>
            <Logo />
        </a>
        <div class="md:flex space-x-5 px-7 font-medium bg-white hidden">
            {#each pages as page}
                <a href={page.path} class="relative flex items-center">
                    <div
                        class={classNames(
                            "flex items-center space-x-2  py-7 transition ease-in-out hover:text-black",
                            {
                                "text-black": isActive(page.prefix),
                            },
                        )}
                    >
                        <span>{page.name}</span>
                    </div>
                    <div
                        class={classNames("absolute bottom-0 left-0 h-0.75", {
                            "bg-primary w-full rounded-t-lg": isActive(page.prefix),
                        })}
                    ></div>
                </a>
            {/each}
        </div>
        <div class="ml-auto flex items-center space-x-5">
            <button onclick={()=> dispatcher.sendSnippet('drawer', drawerContent)} class="md:hidden block">
                <Icon icon={Menu} />
            </button>
            <div class="flex items-center space-x-3">
                <a href="https://github.com/barque-ai" target="_blank" rel="noreferrer">
                    <Github size={18} />
                </a>
                <a href="https://discord.com" target="_blank" rel="noreferrer">
                    <Discord size={18} />
                </a>
            </div>
        </div>
    </div>
</nav>
