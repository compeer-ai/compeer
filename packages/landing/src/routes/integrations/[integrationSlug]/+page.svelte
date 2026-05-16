<script lang='ts'>
	import { page } from "$app/state";
	import { readIntegration } from "$lib/remotes/integration.remote";
    import * as icons from "$lib/components/icons";

    const integration = await readIntegration({ slug: page.params.integrationSlug!! })
</script>

<div class="space-y-3">
    <div class="bg-white text-sm h-7 w-fit flex items-center justify-center px-2 rounded-full border border-gray-300 shadow-gray-100 shadow-sm">
        {integration.tag}
    </div>
    <div class="space-y-2">
    <div class="flex items-center space-x-2">
        <div class="text-black">
            {#snippet icon()}
                {@const Icon = icons[integration.icon]}
                <Icon size={20} />
            {/snippet}
            {@render icon()}
        </div>
        <h2 class="font-semibold text-black text-lg">{integration.name}</h2>
    </div>
    </div>
    <section class="prose max-w-none w-full">
        {@html integration.content}
    </section>
</div>