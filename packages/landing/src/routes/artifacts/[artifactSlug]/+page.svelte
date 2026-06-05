<script lang='ts'>
	import { page } from "$app/state";
    import { readArtifact } from "$lib/remotes/artifact.remote"
    const artifact = await readArtifact({
        slug: page.params.artifactSlug!!
    });
</script>

<div class="space-y-3">
    <div class="space-y-2">
        <h2 class="text-lg font-semibold text-black">{artifact.name}</h2>
        <p>{artifact.description}</p>
    </div>
    <div class="flex space-x-2">
        {#each artifact.tags as tag}
            <div class="h-7 px-3 flex items-center justify-center bg-white rounded-full border border-gray-300">
                {tag}
            </div>
        {/each}
    </div>
</div>