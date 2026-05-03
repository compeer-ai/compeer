<script lang='ts' generics="T extends Record<string, unknown>">
	import { ChevronLeft, ChevronRight } from "@lucide/svelte";
	import type { Snippet } from "svelte";
	import Icon from "./Icon.svelte";
	import { page  as _page} from "$app/state";
	import { goto } from "$app/navigation";

    interface Props {
        data: T[];
        limit: number;
        children: Snippet<[T[]]>
    }
    const { limit, data, children }: Props = $props();
    const pageParam = $derived(_page.url.searchParams.get('page'));
    let page = $derived(pageParam ? Number(pageParam) : 1);
    let totalPages = $derived(Math.ceil(data.length / limit));
    let canGoPrevious = $derived(page > 1);
    let canGoNext = $derived(page < totalPages);
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
    {@render children(data.slice((page - 1) * limit, Math.min(page * limit, data.length)))}
    <div class="flex justify-between text-black">
        {#if canGoPrevious}
            <button class="space-x-2 flex items-center"  onclick={() => updatePage(page - 1)}>
                <Icon icon={ChevronLeft} />
                <span>Previous</span>
            </button>
        {:else}
            <div></div>
        {/if}
        {#if canGoNext}
            <button class="space-x-2 flex items-center" onclick={() => updatePage(page + 1)}>
                <span>Next</span>
                <Icon icon={ChevronRight} />
            </button>
        {:else}
            <div></div>
        {/if}
    </div>
</div>
