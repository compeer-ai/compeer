<script lang="ts">
  import type { Project } from "$lib/repository/projectRepository";
  import type { Snippet } from "svelte";
  import Logo from "./Logo.svelte";

  interface Props {
    project?: Project;
    children?: Snippet;
  }
  const { project, children }: Props = $props();
</script>

<nav class="border-b border-gray-300">
  <div class="mx-auto max-w-7xl flex items-center space-x-2">
    <Logo />
    {#if project}
      <span class="text-xl">/</span>
      <span class="font-medium text-black text-lg">{project.name}</span>
    {/if}
  </div>
  {#if children}
    <div class="mx-auto max-w-7xl">
      {@render children()}
    </div>
  {/if}
</nav>
