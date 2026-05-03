<script lang="ts">
  import type { LayoutProps } from "./$types";
  import { readStores } from "$lib/remotes/store.remote";
	import { readWorkspace, readWorkspaces } from "$lib/remotes/workspace.remote";
	import { page } from "$app/state";
	import WorkspaceSidebar from "$lib/components/common/WorkspaceSidebar.svelte";
	import { readUser } from "$lib/remotes/user.remote";
	
  const { children }: LayoutProps = $props();

  const workspace = readWorkspace({
    name: page.params.workspace!!
  });
  const user = readUser();
  const workspaces = readWorkspaces({
    limit: undefined,
    offset: undefined
  });
  const stores = $derived.by(() => workspace.current && readStores({
    workspaceId: workspace.current.id
  }));
</script>


{#if stores?.ready && workspace.ready && workspaces.ready && user.ready}
    <div class="flex">
      <WorkspaceSidebar stores={stores.current} workspaces={workspaces.current} user={user.current} />
      <div
        class="h-screen w-full overflow-y-auto border-l border-gray-300"
        style={`background-color: #fff;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.07' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");`}
      >
        {@render children()}
      </div>
    </div>
{/if}
