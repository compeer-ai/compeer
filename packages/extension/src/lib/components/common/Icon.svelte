<script lang="ts">
  import { type Icon as IconType } from "@lucide/svelte";
  import classNames from "classnames";

  interface Props {
    icon: typeof IconType;
    size?: number;
    strokeWidth?: number;
    className?: string;
  }

  let { icon: Icon, size = 15, className, strokeWidth = 2 }: Props = $props();
</script>

<div
  class={classNames("flex items-center justify-center", className)}
  style={`height: ${size}px`}
>
  <Icon {size} {strokeWidth} />
</div>
