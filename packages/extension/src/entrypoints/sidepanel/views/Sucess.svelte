<script lang="ts">
  import { Check } from "@lucide/svelte";
  import { animations } from "../../../lib/utilities/animations";
  import Icon from "../../../lib/components/common/Icon.svelte";
  import Logo from "../../../lib/components/common/Logo.svelte";
</script>

<main
  class="h-[calc(100vh-60.67px)] w-full flex items-center justify-center text-base"
  use:animations.fadeInForward
>
  <nav class="border-b border-gray-300 py-4 px-5">
    <Logo />
  </nav>
  <div class="space-x-2 flex items-center">
    <div
      class="bg-green-800 text-white h-7 w-7 rounded-full flex items-center justify-center"
    >
      <Icon icon={Check} size={15} />
    </div>
    <span class="text-lg font-medium text-black">Sent to Barque</span>
  </div>
</main>
