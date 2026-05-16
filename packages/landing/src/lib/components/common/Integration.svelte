<script lang='ts'>
	import type { Integration } from "$lib/models/integration";
	import type { Snippet } from "svelte";

    interface Props {
        integration: Integration
        icon: Snippet
    }
    const { integration, icon }: Props = $props();
</script>

<a href={`/integrations/${integration.slug}`}>
<div class="border bg-white space-y-3 hover:bg-gray-100/30 transition ease-in-out p-5 border-gray-300 text-left rounded-lg shadow-gray-100 shadow-sm text-center">
    <div class="text-sm bg-white h-7 w-fit flex items-center justify-center px-2 rounded-full border border-gray-300 shadow-gray-100 shadow-sm">
        {integration.tag}
    </div>
    <div class="space-y-2">
    <div class="flex items-center space-x-2">
        <div class="text-black">
            {@render icon()}
        </div>
        <h2 class="font-semibold text-black text-lg">{integration.name}</h2>
    </div>
        <span class="line-clamp-1 truncate">{integration.description}</span>
    </div>
</div>

</a>
