<script lang='ts'>
        import Integration from "$lib/components/common/Integration.svelte";
        import { readIntegrations } from "$lib/remotes/integration.remote";
        import * as icons from "$lib/components/icons";
        import Meta from "$lib/components/common/Meta.svelte";
        const integrations = await readIntegrations();
</script>

<Meta
        title="Compeer: Integrations"
        description="Explore all tools and platforms that integrate with Compeer."
/>
<section class="grid md:grid-cols-3 gap-5 grid-cols-1">
{#each integrations as integration}
        {#snippet icon()}
                {@const Icon = icons[integration.icon as keyof typeof icons]}
                <Icon size={20} />
        {/snippet}
        <Integration {integration} {icon}/>
{/each}
</section>
