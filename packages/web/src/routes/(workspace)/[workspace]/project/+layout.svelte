<script lang="ts">
  import { page } from "$app/state";
  import ProjectSubheader from "$lib/components/common/ProjectSubheader.svelte";
	import type { LayoutProps } from "./$types";
  const { children }: LayoutProps = $props();
</script>

<div class="h-screen w-full">
  {#key page.params.projectId}
    <ProjectSubheader />
    {@render children()}
  {/key}
</div>
