<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    className?: string;
    children: Snippet;
  }

  const { children, className }: Props = $props();
</script>

<nav>
  <ol class={["flex items-center space-x-3", className]}>
    {children}
  </ol>
</nav>
