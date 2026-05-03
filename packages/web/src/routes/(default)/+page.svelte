<script lang='ts'>
	import Icon from "$lib/components/common/Icon.svelte";
	import Paginated from "$lib/components/common/Paginated.svelte";
	import Search from "$lib/components/common/Search.svelte";
	import Workspace from "$lib/components/common/Workspace.svelte";
	import WorkspaceForm from "$lib/components/forms/WorkspaceForm.svelte";
	import { readWorkspaces } from "$lib/remotes/workspace.remote";
	import type { Workspace as IWorkspace } from "$lib/repository/workspaceRepository";
	import { animations } from "$lib/utilities/animations";
	import { config } from "$lib/utilities/config";
	import { dispatcher } from "$lib/utilities/dispatcher";
	import { Plus } from "@lucide/svelte";

  const workspaces = readWorkspaces({
    limit: undefined,
    offset: undefined
  });
  let query = $state("");
  function filerWorkspaces(workspaces: IWorkspace[], query: string) {
        if (!query.length) return workspaces;
        return workspaces.filter((workspace) =>
            workspace.name.toLowerCase().includes(query.toLowerCase()),
        );
    }
</script>


{#if workspaces.ready}
{#snippet drawerContent()}
    <div class="px-5">
      <WorkspaceForm />
    </div>
{/snippet}
<div class="p-7 space-y-5" use:animations.fadeInForward>
  <div class="flex justify-between">
    <Search bind:query placeholder="Search for a workspace..." />
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
  </div>
  {#if filerWorkspaces(workspaces.current, query).length}
  {#snippet paginatedSubset(subset: IWorkspace[])}
    <div
        class="border border-gray-300 divide-y divide-gray-300 rounded-lg shadow-sm shadow-gray-100 bg-white overflow-hidden"
        use:animations.fadeIn
      >
        {#each filerWorkspaces(subset, query) as workspace}
          <Workspace {workspace} />
        {/each}
    </div>
  {/snippet}
  <Paginated limit={5} data={workspaces.current} children={paginatedSubset} />
  {/if}
</div>
{/if}
