<script lang='ts'>
    import { page } from "$app/state";
    import liam_headshot from "$lib/assets/liam_headshot.jpeg";
	import { readCookbook } from "$lib/remotes/cookbook.remote";

    const cookbook = $derived(await readCookbook({ slug: page.params.cookbookSlug!! }));
</script>

<article class='space-y-5 w-full'>
    <section class='space-y-3'>
        <h1 class='text-2xl font-semibold text-black'>{cookbook.title}</h1>
        <div class="space-x-2 flex items-center">
            <img src={liam_headshot} alt="Liam Grossman" class="h-7 w-7 rounded-full" />
            <span class="font-medium text-sm text-black">Liam Grossman</span>
        </div>
    </section>
    <section class="prose max-w-none w-full">
        {@html cookbook.content}
    </section>
</article>
