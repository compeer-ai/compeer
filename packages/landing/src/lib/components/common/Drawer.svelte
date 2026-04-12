<script lang="ts">
  import type { Snippet } from "svelte";
  import Icon from "./Icon.svelte";
  import { X } from "@lucide/svelte";
  import classNames from "classnames";
  import { animations } from "$lib/utilities/animations";
  import { onMount } from "svelte";

  interface Props {
    handleClose: () => void;
    children: Snippet;
    expanded?: boolean;
  }

  let { handleClose, children, expanded = false }: Props = $props();

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
  class="pointer-events-auto fixed top-0 right-0 bottom-0 left-0 z-200 m-0! bg-black/80 backdrop-blur-sm"
>
  <div
    class={classNames(
      "relative ml-auto flex h-full transform flex-col space-y-5 overflow-y-auto bg-white",
      expanded ? "min-w-125 md:w-1/2" : "min-w-96 md:w-1/3",
    )}
    use:animations.fadeOutRightLeft
  >
    <div class="ml-auto flex items-center space-x-3 p-7 pb-0">
      <button
        class="cursor-pointer"
        onclick={handleClose}
        aria-label="Open Drawer"
      >
        <Icon icon={X} className="text-black" />
      </button>
    </div>
    {@render children()}
  </div>
</div>
