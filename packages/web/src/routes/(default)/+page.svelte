<script lang='ts'>
	import Icon from "$lib/components/common/Icon.svelte";
	import Paginated from "$lib/components/common/Paginated.svelte";
	import Search from "$lib/components/common/Search.svelte";
	import Workspace from "$lib/components/common/Workspace.svelte";
	import ImportProjectForm from "$lib/components/forms/ImportProjectForm.svelte";
	import ImportWorkspaceForm from "$lib/components/forms/ImportWorkspaceForm.svelte";
	import WorkspaceForm from "$lib/components/forms/WorkspaceForm.svelte";
	import { readWorkspaces } from "$lib/remotes/workspace.remote";
	import type { Workspace as IWorkspace } from "$lib/repository/workspaceRepository";
	import { animations } from "$lib/utilities/animations";
	import { config } from "$lib/utilities/config";
	import { dispatcher } from "$lib/utilities/dispatcher";
	import { Download, Plus } from "@lucide/svelte";

  const workspaces = readWorkspaces({
    limit: undefined,
    offset: undefined
  });
  let query = $state("");
  let paginationPage = $state(1);

  function filerWorkspaces(workspaces: IWorkspace[], query: string) {
        if (!query.length) return workspaces;
        return workspaces.filter((workspace) =>
            workspace.name.toLowerCase().includes(query.toLowerCase()),
        );
    }
  const invalidate = () => workspaces!!.refresh();
</script>


{#if workspaces.ready}
{#snippet drawerContent()}
    <div class="px-5">
      <WorkspaceForm />
    </div>
{/snippet}
  {#snippet importProjectDrawerContent()}
  <div class="px-5">
    <ImportWorkspaceForm {invalidate} />
  </div>
{/snippet}
<div class="p-7 space-y-5" use:animations.fadeInForward>
  <div class="flex justify-between">
    <Search bind:query placeholder="Search for a workspace..." onChange={() => paginationPage = 1} />
     <div class="flex space-x-2">
      {#if config.flags.createWorkspaces}
        <button
        class="bg-primary-gradient hover:bg-primary flex h-12 cursor-pointer items-center space-x-2 rounded-lg px-3 text-white transition ease-in-out"
        onclick={() => {
          dispatcher.send("drawer", drawerContent);
        }}
      >
        <Icon icon={Plus}></Icon>
        <span>Add Workspace</span>
      </button>
    {/if}
     {#if config.flags.importWorkspaces}
      <button
        class="bg-primary-gradient hover:bg-primary flex h-12 cursor-pointer items-center space-x-2 rounded-lg px-3 text-white transition ease-in-out"
        onclick={() => {
          dispatcher.send("drawer", importProjectDrawerContent);
        }}
      >
        <Icon icon={Download}></Icon>
        <span>Import Workspace</span>
      </button>
    {/if}

     </div>
  </div>
  {#snippet paginatedSubset(subset: IWorkspace[])}
    <div
        class="border border-gray-300 divide-y divide-gray-300 rounded-lg shadow-sm shadow-gray-100 bg-white overflow-hidden"
        use:animations.fadeIn
      >
        {#each subset as workspace}
          <Workspace {workspace} />
        {/each}
    </div>
  {/snippet}
  {#if filerWorkspaces(workspaces.current, query).length}
    <Paginated limit={5} bind:page={paginationPage} data={filerWorkspaces(workspaces.current, query)} children={paginatedSubset} />
  {/if}
</div>
{/if}
