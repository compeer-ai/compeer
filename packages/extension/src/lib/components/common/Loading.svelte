<script lang="ts">
  import Icon from "./Icon.svelte";
  import { LoaderCircle } from "@lucide/svelte";
</script>

<div class="flex items-center h-screen space-x-2 justify-center">
  <div class="animate-spin">
    <Icon icon={LoaderCircle} size={21} className="text-black" />
  </div>
  <span class="text-black font-medium text-xl">Loading</span>
</div>
