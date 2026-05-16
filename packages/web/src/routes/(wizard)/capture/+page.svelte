<script lang='ts'>
	import { goto } from "$app/navigation";
	import { commandCreateCapture } from "$lib/remotes/capture.remote.js";
	import { readStores } from "$lib/remotes/store.remote.js";
	import { readWorkspaces } from "$lib/remotes/workspace.remote";
	import type { Store } from "$lib/repository/storeRepository.js";
	import { animations } from "$lib/utilities/animations.js";
	
    let { data } = $props();
    const Step = {
        workspace: 0,
        store: 1,
    } as const;
    const workspaces = readWorkspaces({
        limit: undefined,
        offset: undefined
    });
    let step = $state<number>(Step.workspace)
    let workspace = $state<string>();
    let stores = $state<Store[]>()
</script>

{#snippet selection<T extends { title: string, value: string }>(args: { items: T[], onSelect: (item: T) => void | Promise<void>})}
    <div class="border divide-y divide-gray-300 border-gray-300 rounded-lg shadow-sm shadow-gray-100">
        {#each args.items as item}
            <button class="py-4 flex px-5 w-full hover:bg-gray-100/30 transition ease-in-out" onclick={() => args.onSelect(item)}>
                {item.title}
            </button>
        {/each}
    </div>
{/snippet}
{#if workspaces.ready}
    {#if step == Step.workspace}
        {@const items = workspaces.current.map((workspace) => ({ title: workspace.name, value: workspace.id }))}
        <section class="space-y-3" use:animations.fadeInForward>
            <h1 class="text-lg font-semibold text-black">Select a Workspace</h1>
            {@render selection({ items, onSelect: async (selectedWorkspace) => {
                stores = await readStores({ workspaceId: selectedWorkspace.value, limit: undefined, offset: undefined })
                workspace = selectedWorkspace.title;
                step = Step.store;
            }})}
        </section>
    {/if}
    {#if step == Step.store && stores}
        <section class="space-y-3" use:animations.fadeInForward>
            <h1 class="text-xl font-semibold text-black">Select a Store</h1>
            {@render selection({ items: stores.map((item) => ({ title: item.name, value: item.id })), onSelect: async (selectedStore) => {
                const { text, url } = data;
                if (text) {
                    await commandCreateCapture({
                        type: 'text',
                        content: text,
                        storeId: selectedStore.value 
                    })
                } else if (url) {
                    await commandCreateCapture({
                        type: 'url',
                        content: url,
                        storeId: selectedStore.value 
                    })
                }
                await goto(`/${workspace}/store/${selectedStore.value}/captures`)
            }})}
        </section>
    {/if}
{/if}