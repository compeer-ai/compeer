<script lang="ts">
  import Form from "../common/Form.svelte";
  import Input from "../common/Input.svelte";
  import HiddenInput from "../common/HiddenInput.svelte";
	import type { Workspace } from "$lib/repository/workspaceRepository";
	import { formCreateWorkspace, formUpdateWorkspace } from "$lib/remotes/workspace.remote";
	import { goto } from "$app/navigation";

  interface Props {
    workspace?: Workspace;
  }

  const { workspace }: Props = $props();
  let name = $derived(workspace ? workspace.name : '')
</script>

<Form
  toastMessage={workspace ? "Updated Workspace" : "Created Workspace"}
  submitButtonTitle={`${workspace ? "Update" : "Create"} Workspace`}
  remote={workspace ? formUpdateWorkspace : formCreateWorkspace}
  className="space-y-5"
  onSuccess={async () => {
    if (workspace) {
      await goto(`/${name}/settings`)
    }
  }}
>
  {#if workspace}
    <HiddenInput {...formUpdateWorkspace.fields.id.as("hidden", workspace.id)} />
  {/if}
  <Input
    {...formCreateWorkspace.fields.name.as("text")}
    bind:value={name}
    label="Name"
    placeholder="Name"
    required
  />
</Form>
