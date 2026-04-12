<script lang="ts">
  import { animations } from "$lib/utilities/animations";
  import { onDestroy, type Snippet } from "svelte";
  import classNames from "classnames";

  interface Props {
    content: String;
    children: Snippet;
    align?: "center" | "left" | "right";
  }

  let container = $state<HTMLElement>();
  let show = $state(false);
  const { content, children, align = "center" }: Props = $props();

  function handleMouseEnter() {
    show = true;
  }

  function handleMouseLeave() {
    show = false;
  }

  $effect(() => {
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
  });

  onDestroy(() => {
    container?.removeEventListener("mouseenter", handleMouseEnter);
    container?.removeEventListener("mouseleave", handleMouseLeave);
  });
</script>

<div bind:this={container} class="relative inline-flex">
  {@render children()}
  {#if show}
    <div
      class={classNames(
        "absolute text-sm px-2 py-1 flex items-center justify-center bg-white text-black border border-gray-300 rounded-md shadow-sm shadow-gray-100 z-50 w-fit whitespace-nowrap top-full mt-1",
        {
          "left-1/2 -translate-x-1/2": align === "center",
          "left-0": align === "left",
          "right-0": align === "right",
        },
      )}
      use:animations.fadeIn
    >
      {content}
    </div>
  {/if}
</div>
