<script lang="ts">
  import { ChevronDown } from "@lucide/svelte";
  import type { Snippet } from "svelte";
  import Icon from "./Icon.svelte";
  import classNames from "classnames";

  interface Props {
    title: string;
    children: Snippet;
    collaspable?: boolean;
  }
  let collapsed = $state(false);
  let { children, title, collaspable }: Props = $props();
</script>

<div
  class="divide-y divide-gray-300 bg-white rounded-lg border border-gray-300 shadow-sm shadow-gray-100"
>
  <div class="flex w-full items-center justify-between px-5 py-3">
    <h2 class="font-medium text-black">{title}</h2>
    {#if collaspable}
      <button onclick={() => (collapsed = !collapsed)} class="cursor-pointer">
        <Icon
          icon={ChevronDown}
          className={classNames("transition transform text-black", {
            "-rotate-90": collapsed,
          })}
          size={15}
        />
      </button>
    {/if}
  </div>
  {#if !collapsed}
    {@render children()}
  {/if}
</div>
