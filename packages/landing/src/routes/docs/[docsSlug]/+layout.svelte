<script lang='ts'>
    import { readDocs } from "$lib/remotes/doc.remote"
    import Sidebar from "$lib/components/common/Sidebar.svelte";
	import type { Snippet } from "svelte";
	import { BookOpen, Pen } from "@lucide/svelte";
	import Icon from "$lib/components/common/Icon.svelte";
	import { page } from "$app/state";
    interface Props {
        children: Snippet;
    }

    const docs = await readDocs();
    const { children }: Props = $props();
</script>

<div class="flex w-full space-y-5 md:space-y-0 md:items-start md:flex-row flex-col">
    <Sidebar {docs} />   
    <div class='w-full space-y-5'>
        <div>
            {@render children()}
        </div>
    <div class="border-t flex space-x-5 border-gray-300 w-full">
        <a href={`https://github.com/compeer-ai/compeer/tree/main/packages/landing/src/lib/markdown/docs/${page.params.docsSlug!!}.svx`} target="_blank" rel="noopener noreferrer">
            <button class="space-x-2 flex items-center pt-5 hover:text-black cursor-pointer transition ease-in-out">
                <Icon icon={Pen} />
                <span>Edit on GitHub</span>        
            </button>
        </a>
        <a href={`/docs/${page.params.docsSlug!!}/llms`}>
        <button class="space-x-2 flex items-center pt-5 hover:text-black cursor-pointer transition ease-in-out">
            <Icon icon={BookOpen} />
            <span>llms.txt</span>        
        </button>
    </a>
    </div>
    </div>
</div>
