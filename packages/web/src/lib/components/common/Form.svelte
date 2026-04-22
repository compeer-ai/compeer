<script lang="ts">
  import type { RemoteForm } from "@sveltejs/kit";
  import type { Snippet } from "svelte";
  import Loading from "./Loading.svelte";
  import { dispatcher } from "$lib/utilities/dispatcher";
  import { delay } from "$lib/utilities/delay";
	import { readProjects } from "$lib/remotes/store.remote";
	import { readWorkspace } from "$lib/remotes/workspace.remote";
	import { page } from "$app/state";

  interface Props {
    remote: RemoteForm<any, any>;
    onSuccess?: () => void | Promise<void>;
    className?: string;
    children?: Snippet;
    toastMessage: string;
    submitButtonTitle: string;
  }

  const {
    remote,
    className,
    children,
    submitButtonTitle,
    onSuccess,
    toastMessage,
  }: Props = $props();
  let loading = $state(false);
</script>

<form
  enctype="multipart/form-data"
  class={className || ""}
  {...remote.enhance(async ({ submit }) => {
    await delay();
    await submit();
    await Promise.resolve(onSuccess?.());
    loading = false;
    dispatcher.state("closeDrawer", {});
    dispatcher.state("closeModal", {});
    dispatcher.state("toast", {
      message: toastMessage,
      level: "success",
      id: Date.now(),
    });
  })}
>
  {@render children?.()}
  <button
    type="submit"
    class="bg-primary-gradient hover:bg-primary flex h-12 w-full cursor-pointer items-center justify-center rounded-lg text-white shadow-sm shadow-gray-100 transition ease-in-out"
    onclick={(event) => {
      const element = event.currentTarget;
      const form = element.parentElement as HTMLFormElement;
      if (form.checkValidity()) {
        loading = true;
      }
    }}
  >
    {#if loading}
      <Loading title="Loading" />
    {:else}
      {submitButtonTitle}
    {/if}
  </button>
</form>
