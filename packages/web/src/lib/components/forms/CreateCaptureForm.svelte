<script lang="ts">
  import { formCreateCapture } from "$lib/remotes/capture.remote";
  import { Braces, Link, Type } from "@lucide/svelte";
  import Form from "../common/Form.svelte";
  import HiddenInput from "../common/HiddenInput.svelte";
  import Textarea from "../common/Textarea.svelte";
  import Icon from "../common/Icon.svelte";
  import Input from "../common/Input.svelte";
  import JsonTextarea from "../common/JsonTextarea.svelte";

  interface Props {
    projectId: string;
    invalidate: () => Promise<void>;
  }

  const { projectId, invalidate }: Props = $props();
  let type = $state<"data" | "text" | "url">();
</script>

{#if !type}
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <h1 class="font-medium text-black text-lg">Select a capture type</h1>
      <span class="font-mono text-sm">1/2</span>
    </div>
    <div
      class="divide-y divide-gray-300 border border-gray-300 shadow-sm shadow-gray-100 rounded-lg text-black"
    >
      <button
        class="px-5 py-5 w-full space-x-2 items-center flex hover:bg-gray-100/30 transition ease-in-out"
        onclick={() => (type = "url")}
      >
        <Icon icon={Link} />
        <span>Website</span>
      </button>
      <button
        class="px-5 py-5 w-full space-x-2 items-center flex hover:bg-gray-100/30 transition ease-in-out"
        onclick={() => (type = "text")}
      >
        <Icon icon={Type} />
        <span>Text</span>
      </button>
      <button
        class="px-5 py-5 w-full space-x-2 items-center flex hover:bg-gray-100/30 transition ease-in-out"
        onclick={() => (type = "data")}
      >
        <Icon icon={Braces} />
        <span>Data</span>
      </button>
    </div>
  </section>
{:else}
  <section class="space-y-3">
    <div class="flex items-center justify-between">
      <h1 class="font-medium text-black text-lg">Create your capture</h1>
      <span class="font-mono text-sm">2/2</span>
    </div>
    <Form
      remote={formCreateCapture}
      toastMessage={"Created Capture"}
      className="space-y-5"
      submitButtonTitle={"Create Capture"}
      onSuccess={invalidate}
    >
      <HiddenInput
        {...formCreateCapture.fields.projectId.as("hidden", projectId)}
      />
      <HiddenInput {...formCreateCapture.fields.type.as("hidden", type)} />
      {#if type === "text"}
        <Textarea
          name={formCreateCapture.fields.content.as("text").name}
          label="Text"
          placeholder="Enter your text here..."
          required
        />
      {:else if type === "data"}
        <JsonTextarea
          name={formCreateCapture.fields.content.as("text").name}
          label="Data"
          placeholder={JSON.stringify({ name: "John Doe" })}
          required
        />
      {:else}
        <Input
          label="Website URL"
          placeholder="https://example.com"
          name={formCreateCapture.fields.content.as("text").name}
          type="url"
          required
        />
      {/if}
    </Form>
  </section>
{/if}
