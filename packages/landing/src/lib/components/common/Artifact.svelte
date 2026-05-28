<script lang='ts'>
    interface Props {
        title: string
        description: string;
        tags: string[]
    }
    const { title, description, tags }: Props = $props();
</script>

<div class="border border-gray-300 shadow-sm shadow-gray-100 bg-white rounded-lg space-y-3">
    <div class="space-y-2">
        <h2 class="text-lg font-medium text-black">{title}</h2>
        <p>{description}</p>
    </div>
    <div class="flex space-x-2">
        {#each tags as tag}
            <div class="h-7 px-3 rounded-full border border-gray-300">
                {tag}
            </div>
        {/each}
    </div>
</div>