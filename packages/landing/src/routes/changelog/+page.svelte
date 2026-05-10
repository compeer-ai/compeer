<script lang='ts'>
    import changelogs from "$lib/data/changelog.json";
</script>

{#if changelogs.length}

<section class="border border-gray-300 rounded-lg divide-y divide-gray-300 shadow-sm shadow-gray-100 w-full flex flex-col bg-white">
    {#each changelogs as changelog}
        <a href={`https://github.com/compeer-ai/barque/releases/tag/${changelog.version}`} target="_blank" rel="noopener noreferrer">
        <button class="md:space-x-15 md:space-y-0 space-y-3 w-full p-5 md:flex relative hover:bg-gray-100/30 transition ease-in-out">
            <div class="space-y-1 text-left md:sticky top-5 self-start">
                <h2 class="font-medium text-black">
                    {changelog.version}
                </h2>
                <span class="text-sm">{changelog.date}</span>
            </div>
        </button>
        </a>
    {/each}
</section>
{:else}
    <p class="text-center">Come back soon! Nothing here, yet...</p>

{/if}
