<script lang='ts'>
	import Github from "$lib/components/icons/Github.svelte";
	import Notion from "$lib/components/icons/Notion.svelte";
	import { readCookbooks } from "$lib/remotes/cookbook.remote";

    const cookbooks = await readCookbooks();

    const iconMapper = {
        notion,
        github
    }
</script>

{#snippet notion()}
    <Notion size={18} />
{/snippet}
{#snippet github()}
    <Github size={18} />
{/snippet}

<section class="grid md:grid-cols-3 grid-cols-1 gap-4">
    {#each cookbooks as cookbook}
        <a href={`/cookbook/${cookbook.slug}`}>
            <div class="space-y-3 p-5 w-full border border-gray-300 bg-white rounded-lg shadow-sm shadow-gray-100">
                <h2 class="font-medium text-black">{cookbook.title}</h2>
                <div class="-space-x-1 flex items-center"> 
                    {#each cookbook.icons as icon}
                        <div class="border border-gray-300 rounded-full bg-white p-2">
                            {@render iconMapper[icon as keyof typeof iconMapper]()}
                        </div>
                    {/each}
                </div>
            </div>
        </a>
    {/each}
</section>