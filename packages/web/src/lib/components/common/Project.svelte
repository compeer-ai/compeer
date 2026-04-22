<script lang="ts">
  import type { Store } from "$lib/repository/projectRepository";
  import {
    Activity,
    Settings2,
    SquareDashedMousePointer,
  } from "@lucide/svelte";
  import Icon from "./Icon.svelte";
	import { page } from "$app/state";

  interface Props {
    store: Store;
  }

  const { store }: Props = $props();
</script>

<div
  class="p-5 group flex flex-row justify-between items-center hover:bg-gray-100/30 transition ease-in-out"
>
  <a href={`/${page.params.workspace!!}/store/${store.id}/captures`} class="flex-1 block">
    <h2 class="font-medium text-black w-full">
      {store.name}
    </h2>
  </a>
  <div
    class="space-x-3 flex items-center group-hover:opacity-100 group-hover:scale-100 scale-99 opacity-0 ease-in-out transition"
  >
    <a href={`/${page.params.workspace!!}/store/${store.id}/captures`}>
      <button
        class="text-sm cursor-pointer flex font-medium px-3 items-center h-7 space-x-2 text-black border border-gray-300 rounded-full shadow-sm shadow-gray-100"
      >
        <Icon icon={SquareDashedMousePointer} size={15} />
        <span>Captures</span>
      </button>
    </a>
    <a href={`/${page.params.workspace!!}/store/${store.id}/settings`}>
      <button
        class="text-sm cursor-pointer flex font-medium px-3 items-center h-7 space-x-2 text-black border border-gray-300 rounded-full shadow-sm shadow-gray-100"
      >
        <Icon icon={Settings2} size={15} />
        <span>Settings</span>
      </button>
    </a>
  </div>
</div>
