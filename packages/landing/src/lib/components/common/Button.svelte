<script lang="ts">
  import classNames from "classnames";
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    className?: string;
    onclick?: () => void;
    variant?: "wide" | "standard";
  }
  const {
    className,
    children,
    onclick,
    variant = "standard",
  }: Props = $props();
</script>

<button
  {onclick}
  class={classNames(
    className,
    "h-10 shadow-sm cursor-pointer shadow-gray-100 rounded-lg text-white bg-primary-gradient hover:bg-primary transition ease-in-out font-medium px-4",
    {
      "w-full": variant === "wide",
    },
  )}>{@render children()}</button
>
