<script lang="ts">
  import type { Store } from "$lib/repository/projectRepository";
  import type { Snippet } from "svelte";
  import Logo from "./Logo.svelte";

  interface Props {
    store?: Store;
    children?: Snippet;
  }
  const { store, children }: Props = $props();
</script>

<nav class="border-b border-gray-300">
  <div class="mx-auto max-w-7xl flex items-center space-x-2">
    <Logo />
    {#if store}
      <span class="text-xl">/</span>
      <span class="font-medium text-black text-lg">{store.name}</span>
    {/if}
  </div>
  {#if children}
    <div class="mx-auto max-w-7xl">
      {@render children()}
    </div>
  {/if}
</nav>
