<script lang='ts'>
	import type { Snippet } from "svelte";

    interface Props {
        name: string;
        tag: 'Agent' | 'Inference' | 'Cloud' | 'Developer Tool'
        description: string;
        icon: Snippet;
    }
    const { name, description, icon, tag }: Props = $props();
    const slug = $derived(name.replaceAll(" ", "-").toLowerCase());
</script>

<a href={`/integrations/${slug}`}>
<div class="border bg-white space-y-3 hover:bg-gray-100/30 transition ease-in-out p-5 border-gray-300 text-left rounded-lg shadow-gray-100 shadow-sm text-center">
    <div class="text-sm h-7 w-fit flex items-center justify-center px-2 rounded-full border border-gray-300 shadow-gray-100 shadow-sm">
        {tag}
    </div>
    <div class="space-y-2">
    <div class="flex items-center space-x-2">
        <div>
            {@render icon()}
        </div>
        <h2 class="font-semibold text-black text-lg">{name}</h2>
    </div>
        <span>{description}</span>
    </div>
</div>

</a>
