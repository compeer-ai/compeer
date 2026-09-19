<script type="ts">
  import { ChevronRight } from "@lucide/svelte";
  import type { Snippet } from "svelte";

  interface Props {
    className?: string;
    href: string;
    children: Snippet;
  }
  const { children, href, className }: Props = $props();
</script>

<li class={["space-x-2 flex items-center", className]}>
  <a {href}>
    {children}
  </a>
  <ChevronRight size={15} />
</li>
