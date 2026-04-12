<script lang="ts">
  import classNames from "classnames";
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    className?: string;
    onclick: () => void;
  }
  const { className, children, onclick }: Props = $props();
</script>

<button
  {onclick}
  class={classNames(
    className,
    "h-10 shadow-sm cursor-pointer shadow-gray-100 rounded-lg text-white bg-primary-gradient hover:bg-primary-hover transition ease-in-out font-medium px-3",
  )}>{@render children()}</button
>
