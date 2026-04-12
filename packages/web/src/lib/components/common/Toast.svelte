<script lang="ts">
  import classNames from "classnames";
  import Icon from "./Icon.svelte";
  import { Check, Loader2, X } from "@lucide/svelte";
  import { animate } from "motion";
  import { onMount } from "svelte";
  import type { Toast } from "$lib/models/toast";

  interface Props {
    toast: Toast;
  }

  const { toast }: Props = $props();

  onMount(() => {
    const element = document.getElementById(`${toast.id}`) as HTMLElement;
    animate(
      element,
      {
        opacity: 1,
        filter: "blur(0px)",
        transform: "translateY(0px) scale(1)",
      },
      {
        duration: 0.25,
        delay: 0.1,
        ease: "easeOut",
      },
    ).then(() => {
      animate(
        element,
        {
          opacity: 0,
          filter: "blur(2px)",
          transform: "translateY(8px) scale(.95)",
        },
        {
          duration: 0.25,
          delay: 2,
          ease: "easeOut",
        },
      );
    });
  });
</script>

<div
  id={`${toast.id}`}
  class={classNames(
    "fixed right-5 bottom-5 z-300 flex w-fit items-center bg-white space-x-2 rounded-lg p-3 text-black transition-all border border-gray-300",
  )}
  style="transform: translateY(8px) scale(.95); opacity: 0; filter: blur(2px)"
>
  <div class="flex items-center space-x-2">
    {#if toast.level !== "loading"}
      <div
        class={classNames(
          "h-5 w-5 flex items-center justify-center rounded-full  text-white",
          {
            "bg-green-800": toast.level === "success",
            "bg-red-600": toast.level === "failure",
          },
        )}
      >
        {#if toast.level === "success"}
          <Icon icon={Check} size={12} />
        {:else}
          <Icon icon={X} size={12} />
        {/if}
      </div>
      <span class="text-medium text-sm">{toast.message}</span>
    {:else}
      <Icon icon={Loader2} size={15} className="animate-spin" />
      <span class="text-medium text-sm">{toast.message}</span>
    {/if}
  </div>
</div>
