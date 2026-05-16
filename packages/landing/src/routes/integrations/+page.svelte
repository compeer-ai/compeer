<script lang='ts'>
        import Integration from "$lib/components/common/Integration.svelte";
        import { readIntegrations } from "$lib/remotes/integration.remote";
        import * as icons from "$lib/components/icons";
        const integrations = await readIntegrations();
</script>

<section class="grid md:grid-cols-3 gap-5 grid-cols-1">
{#each integrations as integration}
        {#snippet icon()}
                {@const Icon = icons[integration.icon as keyof typeof icons]}
                <Icon size={20} />
        {/snippet}
        <Integration {integration} {icon}/>
{/each}
</section>
