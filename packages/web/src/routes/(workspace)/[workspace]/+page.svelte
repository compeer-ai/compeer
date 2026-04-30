<script lang="ts">
  import Search from "$lib/components/common/Search.svelte";
  import { animations } from "$lib/utilities/animations";
  import Metadata from "$lib/components/common/Metadata.svelte";
  import { Download, Plus } from "@lucide/svelte";
  import Icon from "$lib/components/common/Icon.svelte";
  import { dispatcher } from "$lib/utilities/dispatcher";
  import ProjectForm from "$lib/components/forms/ProjectForm.svelte";
  import type { Store as IStore } from "$lib/repository/storeRepository";
  import { readStores } from "$lib/remotes/store.remote";
	import { readWorkspace } from "$lib/remotes/workspace.remote";
	import { page } from "$app/state";
	import ImportProjectForm from "$lib/components/forms/ImportProjectForm.svelte";
	import { config } from "$lib/utilities/config";
	import Store from "$lib/components/common/Store.svelte";
	import Paginated from "$lib/components/common/Paginated.svelte";

  let query = $state("");
  function filterProjects(stores: IStore[], query: string) {
    if (!query.length) return stores;
    return stores.filter((store) =>
      store.name.toLowerCase().includes(query.toLowerCase()),
    );
  }

  const workspace = readWorkspace({
    name: page.params.workspace!!
  })
  const stores = $derived.by(() => workspace.current && readStores({
    workspaceId: workspace.current.id
  }));
  const invalidate = () => stores!!.refresh()
</script>

<Metadata title="Compeer: Home" />
{#if stores?.ready && workspace.ready}
<section class="space-y-5 p-7" use:animations.fadeInForward>
  <div class="flex justify-between">
    <Search bind:query placeholder="Search for a store..." />
    {#snippet addProjectDrawerContent()}
      <div class="px-5">
        <ProjectForm workspaceId={workspace.current.id} {invalidate} />
      </div>
    {/snippet}
      {#snippet importProjectDrawerContent()}
      <div class="px-5">
        <ImportProjectForm workspaceId={workspace.current.id} {invalidate} />
      </div>
    {/snippet}
  <div class="space-x-2 flex">
    <button
      class="bg-primary-gradient hover:bg-primary flex h-12 cursor-pointer items-center space-x-2 rounded-lg px-3 text-white transition ease-in-out"
      onclick={() => {
        dispatcher.send("drawer", addProjectDrawerContent);
      }}
    >
      <Icon icon={Plus}></Icon>
      <span>Add Store</span>
    </button>
    {#if config.flags.importProjects}
      <button
        class="bg-primary-gradient hover:bg-primary flex h-12 cursor-pointer items-center space-x-2 rounded-lg px-3 text-white transition ease-in-out"
        onclick={() => {
          dispatcher.send("drawer", importProjectDrawerContent);
        }}
      >
        <Icon icon={Download}></Icon>
        <span>Import Store</span>
      </button>
    {/if}
  </div>
  </div>
  {#snippet paginatedSubset(args: { subset: IStore[] })}
  {@const { subset: stores } = args}
  {#if filterProjects(stores, query).length}
    <div
      class="border border-gray-300 divide-y divide-gray-300 rounded-lg shadow-sm shadow-gray-100 bg-white overflow-hidden"
      use:animations.fadeIn
    >
      {#each filterProjects(stores, query) as store}
        <Store {store} />
      {/each}
    </div>
  {/if}    
  {/snippet}
  <Paginated offset={10} data={stores.current} children={(subset) => paginatedSubset(subset)} />
</section>
{/if}