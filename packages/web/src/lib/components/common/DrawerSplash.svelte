<script lang="ts">
  import { type Icon as IconType } from "@lucide/svelte";
  import Icon from "./Icon.svelte";

  interface Props {
    message: string;
    icon?: typeof IconType;
  }

  const { message, icon }: Props = $props();
</script>

<div
  class="flex flex-col items-center h-[calc(100vh-55px)] space-y-2 justify-center"
>
  {#if icon}
    <Icon {icon} size={25} />
  {/if}
  <span>{message}</span>
</div>
