<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "./Icon.svelte";
  import { X } from "@lucide/svelte";
  import { animations } from "$lib/utilities/animations";
  import { onMount } from "svelte";

  interface Props {
    handleClose: () => void;
    children: Snippet;
  }

  let { handleClose, children }: Props = $props();

  onMount(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  });
</script>

<div
  class="pointer-events-auto fixed top-0 right-0 bottom-0 left-0 z-200 !m-0 bg-black/[.8] px-7 backdrop-blur-sm"
>
  <div
    class="mx-auto mt-10 flex max-w-[650px] flex-col space-y-5 overflow-y-auto rounded-lg bg-white p-5"
    use:animations.fadeInForward
  >
    <button
      class="ml-auto flex cursor-pointer text-black"
      onclick={handleClose}
      aria-label="Open Drawer"
    >
      <Icon icon={X}></Icon>
    </button>
    {@render children()}
  </div>
</div>
