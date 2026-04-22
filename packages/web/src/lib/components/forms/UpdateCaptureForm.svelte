<script lang="ts">
  import { formUpdateCapture } from "$lib/remotes/capture.remote";
  import type { Capture } from "$lib/repository/captureRepository";
  import Form from "../common/Form.svelte";
  import HiddenInput from "../common/HiddenInput.svelte";
  import Textarea from "../common/Textarea.svelte";
  import Toggle from "../common/Toggle.svelte";
  import Input from "../common/Input.svelte";
  import JsonTextarea from "../common/JsonTextarea.svelte";

  interface Props {
    storeId: string;
    invalidate: () => Promise<void>
    capture: Capture;
  }

  const { capture, storeId, invalidate }: Props = $props();
</script>

<Form
  remote={formUpdateCapture}
  toastMessage={"Updated Capture"}
  className="space-y-5"
  submitButtonTitle={"Update Capture"}
  onSuccess={invalidate}
>
  <HiddenInput {...formUpdateCapture.fields.id.as("hidden", capture.id)} />
  <HiddenInput
    {...formUpdateCapture.fields.originalContent.as("hidden", capture.content)}
  />
  {#if capture.url}
    <HiddenInput
      {...formUpdateCapture.fields.originalUrl.as("hidden", capture.url)}
    />
  {/if}
  <HiddenInput
    {...formUpdateCapture.fields.storeId.as("text")}
    value={storeId}
  />
  <HiddenInput {...formUpdateCapture.fields.type.as("hidden", capture.type)} />
  {#if capture.type === "text"}
    <Textarea
      {...formUpdateCapture.fields.content.as("text")}
      value={capture.content}
      label="Text"
      placeholder="Text"
      required
    />
  {:else if capture.type === "data"}
    <JsonTextarea
      {...formUpdateCapture.fields.content.as("text")}
      value={capture.content}
      label="Data"
      placeholder={JSON.stringify({ name: "John Doe" })}
      required
    />
  {:else if capture.type === "url"}
    <Input
      {...formUpdateCapture.fields.content.as("text")}
      value={capture.url}
      label="Website URL"
      placeholder="https://example.com"
      type="url"
      required
    />
  {/if}
  <Toggle
    {...formUpdateCapture.fields.enabled.as('checkbox')}
    label="Enable"
    checked={capture.enabled}
  />
</Form>
