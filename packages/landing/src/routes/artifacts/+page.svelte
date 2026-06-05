<script lang='ts'>
	import Artifact from "$lib/components/common/Artifact.svelte";
	import Meta from "$lib/components/common/Meta.svelte";
    import { readArtifacts } from "$lib/remotes/artifact.remote";
    const artifacts = await readArtifacts();
</script>

<Meta
        title="Compeer: Artifacts"
        description="Explore all tools and platforms that integrate with Compeer."
/>
<section class="grid md:grid-cols-3 gap-5 grid-cols-1">
{#each artifacts as artifact}
    <Artifact {artifact} />
{/each}
</section>
