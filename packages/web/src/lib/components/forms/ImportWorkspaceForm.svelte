<script lang="ts">
  import Form from "../common/Form.svelte";
	import FileInput from "../common/FileInput.svelte";
	import { formImportWorkspace } from "$lib/remotes/workspace.remote";

  interface Props {
    invalidate: () => Promise<void>
  }

  const {  invalidate }: Props = $props();
</script>

<Form
  toastMessage={"Imported Workspace"}
  submitButtonTitle={`Import Workspace`}
  remote={formImportWorkspace}
  onSuccess={invalidate}
  className="space-y-5"
>
  <FileInput
    {...formImportWorkspace.fields.file}
    name="file"
    label="File"
    placeholder="Name"
    required
  />
</Form>
