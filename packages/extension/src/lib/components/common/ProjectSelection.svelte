<script lang="ts">
  import { ChevronRight, LoaderCircle } from "@lucide/svelte";
  import Icon from "./Icon.svelte";
  import { delay } from "../../utilities/delay";

  interface Project {
    name: string;
    id: string;
  }

  interface Props {
    projects: Project[];
    onSelect: (project: Project) => Promise<void>;
    onFinish: () => void;
  }

  const { projects, onSelect, onFinish }: Props = $props();
  let submitting = $state(false);
</script>

<div
  class="border border-gray-300 rounded-lg shadow-sm shadow-gray-100 divide-gray-300"
>
  {#each projects as project}
    <button
      class="px-5 py-4 text-black flex w-full items-center cursor-pointer justify-between"
      onclick={() => {
        submitting = true;
        delay(onSelect(project)).then(() => {
          submitting = false;
          onFinish();
        });
      }}
    >
      <h2 class="font-medium">{project.name}</h2>
      {#if !submitting}
        <Icon icon={ChevronRight} />
      {:else}
        <div class="animate-spin">
          <Icon icon={LoaderCircle} />
        </div>
      {/if}
    </button>
  {/each}
</div>
