<script lang="ts">
    import type { Workspace } from "$lib/repository/workspaceRepository";
	import { Settings2 } from "@lucide/svelte";
	import Icon from "./Icon.svelte";

  interface Props {
    workspace: Workspace;
  }

  const { workspace }: Props = $props();
</script>

<div
  class="p-5 flex flex-row justify-between items-center hover:bg-gray-100/30 transition ease-in-out group"
>
  <a href={`/${workspace.name}`} class="flex-1 block">
    <h2 class="font-medium text-black w-full">
      {workspace.name}
    </h2>
  </a>
   <div
    class="group-hover:opacity-100 group-hover:scale-100 scale-99 opacity-0 ease-in-out transition"
  >
    <a href={`/${workspace.name}/settings`}>
      <button
        class="text-sm cursor-pointer flex font-medium px-3 items-center h-7 space-x-2 text-black border border-gray-300 rounded-full shadow-sm shadow-gray-100"
      >
        <Icon icon={Settings2} size={15} />
        <span>Settings</span>
      </button>
    </a>
  </div>
</div>
