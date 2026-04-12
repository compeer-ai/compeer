<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    className?: string;
    children: Snippet;
  }

  const { children, className }: Props = $props();
</script>

<p class={className}>{@render children()}</p>
