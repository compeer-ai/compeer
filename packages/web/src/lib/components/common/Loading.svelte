<script lang="ts">
  import { type Icon as IconType } from "@lucide/svelte";
  import Icon from "./Icon.svelte";
  import { LoaderCircle } from "@lucide/svelte";

  interface Props {
    title: string;
  }
  const { title }: Props = $props();
</script>

<div class="flex items-center space-x-2">
  <div class="animate-spin">
    <Icon icon={LoaderCircle}></Icon>
  </div>
  <span>{title}</span>
</div>
