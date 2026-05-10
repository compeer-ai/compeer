<script lang='ts' generics="T extends Record<string, unknown>">
	import { ChevronLeft, ChevronRight } from "@lucide/svelte";
	import type { Snippet } from "svelte";
	import Icon from "./Icon.svelte";
	import { page as _page} from "$app/state";

    interface Props {
        data: T[];
        page?: number,
        limit: number;
        children: Snippet<[T[]]>
    }
    let { limit, data, children, page = $bindable(1) }: Props = $props();
    let totalPages = $derived(Math.ceil(data.length / limit));
    let canGoPrevious = $derived(page > 1);
    let canGoNext = $derived(page < totalPages);
    let needsPagination = $derived(totalPages > 1);
</script>

<div class="space-y-4">
    {@render children(data.slice((page - 1) * limit, Math.min(page * limit, data.length)))}
    {#if needsPagination}
        <div class="flex justify-between text-black">
            {#if canGoPrevious}
                <button class="space-x-2 flex items-center"  onclick={() => page = (page - 1)}>
                    <Icon icon={ChevronLeft} />
                    <span>Previous</span>
                </button>
            {:else}
                <div></div>
            {/if}
            {#if canGoNext}
                <button class="space-x-2 flex items-center" onclick={() => page = (page + 1)}>
                    <span>Next</span>
                    <Icon icon={ChevronRight} />
                </button>
            {:else}
                <div></div>
            {/if}
        </div>
    {/if}
</div>
