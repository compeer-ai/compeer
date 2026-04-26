<script lang="ts">
  import Form from "../common/Form.svelte";
  import Input from "../common/Input.svelte";
  import {
    formCreateStore,
	formImportStore,
  } from "$lib/remotes/store.remote";
  import HiddenInput from "../common/HiddenInput.svelte";
	import FileInput from "../common/FileInput.svelte";

  interface Props {
    workspaceId: string;
    invalidate: () => Promise<void>
  }

  const {  workspaceId, invalidate }: Props = $props();
</script>

<Form
  toastMessage={"Imported Store"}
  submitButtonTitle={`Import Store`}
  remote={formImportStore}
  onSuccess={invalidate}
  className="space-y-5"
>
  <HiddenInput {...formCreateStore.fields.workspaceId.as("hidden", workspaceId)} />
  <FileInput
    {...formImportStore.fields.file}
    name="file"
    label="File"
    placeholder="Name"
    required
  />
</Form>
