<script lang="ts">
  import classNames from "classnames";
  import type { Snippet } from "svelte";

  interface Props {
    className?: string;
    children: Snippet;
  }

  let { children, className }: Props = $props();
</script>

<h1
  class={classNames(
    className,
    "text-lg font-semibold text-black tracking-tight"
  )}
>
  {@render children()}
</h1>
