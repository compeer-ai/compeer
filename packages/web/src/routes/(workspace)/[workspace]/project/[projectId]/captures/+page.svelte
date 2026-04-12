<script lang="ts">
  import { animations } from "$lib/utilities/animations";
  import Metadata from "$lib/components/common/Metadata.svelte";
  import Search from "$lib/components/common/Search.svelte";
  import { dispatcher } from "$lib/utilities/dispatcher";
  import { Plus, Trash } from "@lucide/svelte";
  import Icon from "$lib/components/common/Icon.svelte";
  import CaptureForm from "$lib/components/forms/CreateCaptureForm.svelte";
  import { type Capture as ICapture } from "$lib/repository/captureRepository";
  import {
    commandDeleteCaptures,
    readCaptures,
  } from "$lib/remotes/capture.remote";
  import { page } from "$app/state";
  import Captures from "$lib/components/common/Captures.svelte";
  import { delay } from "$lib/utilities/delay";

  let query = $state("");
  let selectedCaptures = $state<Set<string>>(new Set());
  function filterCaptures(captures: ICapture[], query: string) {
    return captures.filter((capture) => {
      return capture.content
        .toLowerCase()
        .trim()
        .includes(query.toLowerCase().trim());
    });
  }

  const captures = readCaptures({
    projectId: page.params.projectId!!
  });
  const invalidate = () => captures.refresh();

  const filteredCaptures = $derived(captures.current
      ? filterCaptures(captures.current as ICapture[], query)
      : [],
  );
  const filteredCaptureIds = $derived(
    new Set(filteredCaptures.map((c) => c.id)),
  );
  const selectedCaptureIds = $derived(
    [...selectedCaptures].filter((id) => filteredCaptureIds.has(id)),
  );
</script>

<Metadata title="Barque: Captures" description="Give AI Eyes" />
{#if captures.ready}
<section
    class="space-y-5 p-7 overflow-y-auto"
    use:animations.fadeInForward
  >
    <div class="flex items-center justify-between">
      <Search bind:query placeholder="Search captures..." />
      {#snippet addCaptureDrawerContent()}
        <div class="px-5">
          <CaptureForm projectId={page.params.projectId!!} {invalidate} />
        </div>
      {/snippet}
      <div class="space-x-3 flex">
        {#if selectedCaptureIds.length}
          <button
            class="bg-primary-gradient hover:bg-primary flex h-12 cursor-pointer items-center space-x-2 rounded-lg px-3 text-white transition ease-in-out"
            use:animations.fadeIn
            onclick={async () => {
              dispatcher.state("toast", {
                message: "Deleting Captures",
                level: "loading",
                id: Date.now(),
              });
              await commandDeleteCaptures({
                projectId: page.params.projectId!!,
                captureIds: selectedCaptureIds,
              });
              await delay(350);
              await invalidate();
              dispatcher.state("toast", {
                message: "Deleted Captures",
                level: "success",
                id: Date.now(),
              });
              selectedCaptures = new Set();
            }}
          >
            <Icon icon={Trash}></Icon>
            <span>Delete Captures</span>
          </button>
        {/if}
        <button
          class="bg-primary-gradient hover:bg-primary flex h-12 cursor-pointer items-center space-x-2 rounded-lg px-3 text-white transition ease-in-out"
          onclick={() => {
            dispatcher.send("drawer", addCaptureDrawerContent);
          }}
        >
          <Icon icon={Plus}></Icon>
          <span>Add Capture</span>
        </button>
      </div>
    </div>
    {#if filteredCaptures.length}
      <Captures
        captures={filteredCaptures}
        {invalidate}
        projectId={page.params.projectId!!}
        bind:selected={selectedCaptures}
      />
    {/if}
  </section>
{/if}