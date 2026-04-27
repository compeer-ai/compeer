<script lang="ts">
  import { page } from "$app/state";
  import StoreSubheader from "$lib/components/common/StoreSubheader.svelte";
	import type { LayoutProps } from "./$types";
  const { children }: LayoutProps = $props();
</script>

<div class="h-screen w-full">
  {#key page.params.storeId}
    <StoreSubheader />
    {@render children()}
  {/key}
</div>
