<script lang="ts">
  import type { Capture } from "$lib/repository/captureRepository";
  import { Braces, Link, Pencil, Trash, Type } from "@lucide/svelte";
  import Icon from "./Icon.svelte";
  import { dispatcher } from "$lib/utilities/dispatcher";
  import Toggle from "./Toggle.svelte";
  import {
    commandDeleteCapture,
    commandUpdateCaptureEnabled,
  } from "$lib/remotes/capture.remote";
  import { animations } from "$lib/utilities/animations";
  import Tooltip from "./Tooltip.svelte";
  import UpdateCaptureForm from "../forms/UpdateCaptureForm.svelte";
  import classNames from "classnames";
  import { delay } from "$lib/utilities/delay";

  interface Props {
    captures: Capture[];
    projectId: string;
    invalidate: () => Promise<void>
    selected?: Set<string>;
  }

  let {
    captures,
    projectId,
    invalidate,
    selected = $bindable(new Set<string>()),
  }: Props = $props();

  function toggleSelection(id: string) {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    selected = newSelected;
  }
</script>

<div
  class="border border-gray-300 bg-white rounded-lg shadow-sm shadow-gray-100 divide-y divide-gray-300"
>
  {#each captures as capture}
    <div use:animations.fadeIn>
      <div
        class="flex items-center justify-between hover:bg-gray-100/30 transition ease-in-out cursor-pointer"
      >
        {#snippet editDrawerContent()}
          <div class="px-5">
            <UpdateCaptureForm
              {capture}
              {invalidate}
              projectId={capture.projectId}
            />
          </div>
        {/snippet}
        <div class="flex items-center min-w-0 flex-1">
          <div
            class="border-r border-gray-200 flex items-center justify-center h-14 px-4"
          >
            <input
              type="checkbox"
              checked={selected.has(capture.id)}
              onchange={() => toggleSelection(capture.id)}
              class="accent-primary cursor-pointer"
            />
          </div>
          <button
            class="flex items-center min-w-0 flex-1"
            onclick={() => dispatcher.send("drawer", editDrawerContent)}
          >
            <div class="flex items-center justify-center h-14 pl-4">
              {#if capture.type === "data"}
                <Tooltip content="Data">
                  <Icon icon={Braces} className="text-black" size={15} />
                </Tooltip>
              {:else if capture.type === "text"}
                <Tooltip content="Text">
                  <Icon icon={Type} className="text-black" size={15} />
                </Tooltip>
              {:else}
                <Tooltip content="Website">
                  <Icon icon={Link} className="text-black" size={15} />
                </Tooltip>
              {/if}
            </div>
            <p
              class={classNames("truncate px-4 text-left", {
                "font-mono": capture.type === "data",
              })}
            >
              {#if capture.type === "url"}
                {capture.url!!}
              {:else}
                {capture.content}
              {/if}
            </p>
          </button>
        </div>
        <div class="space-x-2 text-black flex flex-row items-center h-14 pr-4">
          <Tooltip content="Edit">
            <button
              onclick={() => dispatcher.send("drawer", editDrawerContent)}
              class="h-5"
            >
              <Icon icon={Pencil} />
            </button>
          </Tooltip>
          <Tooltip content="Delete">
            <button
              onclick={async () => {
                dispatcher.state("toast", {
                  message: "Deleting Capture",
                  level: "loading",
                  id: Date.now(),
                });
                await commandDeleteCapture({
                  projectId,
                  id: capture.id,
                });
                await delay(350);
                await invalidate();
                dispatcher.state("toast", {
                  message: "Deleted Capture",
                  level: "success",
                  id: Date.now(),
                });
              }}
              class="h-5"
            >
              <Icon icon={Trash} />
            </button>
          </Tooltip>
          <Tooltip content={capture.enabled ? "Disable" : "Enable"}>
            <Toggle
              checked={capture.enabled}
              onToggled={async () => {
                dispatcher.state("toast", {
                  message: `Capture ${capture.enabled ? "Disabled" : "Enabled"}`,
                  level: "success",
                  id: Date.now(),
                });
                capture.enabled = !capture.enabled;
                await commandUpdateCaptureEnabled({
                  ...capture,
                  enabled: capture.enabled,
                });
                await invalidate();
              }}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  {/each}
</div>
