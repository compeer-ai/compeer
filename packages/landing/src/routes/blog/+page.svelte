<script lang='ts'>
	import { readBlogs } from "$lib/remotes/blog.remote";

    const blogs = await readBlogs();
</script>

<div class="border border-gray-300 rounded-lg divide-y divide-gray-300 shadow-sm shadow-gray-100 w-full flex flex-col bg-white">
    {#each blogs as blog}
        <a href={`/blog/${blog.slug}`}>
            <button class="space-y-2 text-left w-full p-5 hover:bg-gray-100/30 transition ease-in-out">
                <h2 class="font-medium text-black">
                    {blog.title}
                </h2>
                <span>{blog.description}</span>
            </button>
        </a>
    {/each}
</div>
