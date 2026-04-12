<script lang="ts" generics="T">
  import { LoaderCircle } from "@lucide/svelte";
  import Icon from "./Icon.svelte";

  interface Props {
    title: string;
  }
  const { title }: Props = $props();
</script>

<div class="flex items-center space-x-2">
  <Icon icon={LoaderCircle} className="text-black" size={18} />
  <span>{title}</span>
</div>
