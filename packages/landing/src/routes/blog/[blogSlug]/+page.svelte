<script lang='ts'>
    import { readBlog } from "$lib/remotes/blog.remote";
    import { page } from "$app/state";
    import liam_headshot from "$lib/assets/liam_headshot.jpeg";

    const blog = $derived(await readBlog({ slug: page.params.blogSlug!! }));
</script>

<article class='space-y-5 w-full'>
    <section class='space-y-3'>
        <h1 class='text-2xl font-semibold text-black'>{blog.title}</h1>
        <p>{blog.description}</p>
        <div class="space-x-2 flex items-center">
            <img src={liam_headshot} alt="Liam Grossman" class="h-7 w-7 rounded-full" />
            <span class="font-medium text-sm text-black">Liam Grossman</span>
        </div>
    </section>
    <section class="prose max-w-none w-full">
        {@html blog.content}
    </section>
</article>
