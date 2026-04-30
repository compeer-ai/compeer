<script lang='ts' generics="T extends Record<string, unknown>">
	import { ChevronLeft } from "@lucide/svelte";
	import type { Snippet } from "svelte";
	import Icon from "./Icon.svelte";
	import { page  as _page} from "$app/state";
	import { goto } from "$app/navigation";

    interface Props {
        data: T[];
        offset: number;
        children: (args: { subset: T[] }) => ReturnType<Snippet>
    }
    const { offset, data, children }: Props = $props();
    const pageParam = _page.url.searchParams.get('page');
    let page = $derived(pageParam ? Number(pageParam) : 1);
    function updatePage(value: number) {
        const url = new URL(_page.url);
        url.searchParams.set('page', value.toString());
        
        goto(url.href, { 
            replaceState: true, 
            noScroll: true,     
            keepFocus: true     
        });
    }
</script>

<div class="space-y-4">
    {@render children({ subset: data.slice(page, Math.min(offset, data.length)) })}
    <div class="flex justify-between">
        <button class="space-x-2 flex items-center"  onclick={() => updatePage(Math.max(0, page - 1))}>
            <Icon icon={ChevronLeft} />
            <span>Previous</span>
        </button>
        <button class="space-x-2 flex items-center" onclick={() => updatePage(Math.min(page + 1, (data.length / offset)))}>
            <span>Next</span>
            <Icon icon={ChevronLeft} />
        </button>
    </div>
</div>
