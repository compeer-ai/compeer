<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    className?: string;
    children: Snippet;
    href: string;
  }
  const { children, href, className }: Props = $props();
</script>

<a {href} class={className}>
  {children}
</a>
