<script lang="ts">
  import Form from "../common/Form.svelte";
  import Input from "../common/Input.svelte";
  import {
    formCreateProject,
	formImportProject,
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
  remote={formImportProject}
  onSuccess={invalidate}
  className="space-y-5"
>
  <HiddenInput {...formCreateProject.fields.workspaceId.as("hidden", workspaceId)} />
  <FileInput
    {...formImportProject.fields.file}
    label="File"
    placeholder="Name"
    required
  />
</Form>
