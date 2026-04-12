<script lang="ts">
    import type { Workspace } from "$lib/repository/workspaceRepository";

  interface Props {
    workspace: Workspace;
  }

  const { workspace }: Props = $props();
</script>

<div
  class="p-5 hover:bg-gray-100/30 transition ease-in-out"
>
  <a href={`/${workspace.name}`} class="flex-1 block">
    <h2 class="font-medium text-black w-full">
      {workspace.name}
    </h2>
  </a>
</div>
