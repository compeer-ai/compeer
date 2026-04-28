<script lang='ts' generics="T extends Record<string, unknown>">
	import { ChevronLeft } from "@lucide/svelte";
	import type { Snippet } from "svelte";
	import Icon from "./Icon.svelte";

    interface Props {
        limit: number;
        offset: number;
        data: T[]
        children: (args: { subset: T[] }) => ReturnType<Snippet>
    }
    const { limit, offset, data, children }: Props = $props();
    let cursor = $derived(0);
</script>

<div class="space-y-4">
    {@render children({ subset: data.slice(cursor, Math.min(offset, data.length)) })}
    <div class="flex justify-between">
        <button class="space-x-2 flex items-center"  onclick={() => cursor = Math.max(cursor - limit, 0)}>
            <Icon icon={ChevronLeft} />
            <span>Previous</span>
        </button>
        <button class="space-x-2 flex items-center" onclick={() => cursor = Math.min(cursor + limit, data.length)}>
            <span>Next</span>
            <Icon icon={ChevronLeft} />
        </button>
    </div>
</div>
