<script lang="ts">
  import Form from "../common/Form.svelte";
  import Input from "../common/Input.svelte";
  import type { Store } from "$lib/repository/storeRepository";
  import {
    formUpdateProject,
    formCreateProject,
  } from "$lib/remotes/store.remote";
  import HiddenInput from "../common/HiddenInput.svelte";
  import Textarea from "../common/Textarea.svelte";

  interface Props {
    store?: Store;
    workspaceId: string;
    invalidate: () => Promise<void>
  }

  const { store, workspaceId, invalidate }: Props = $props();
</script>

<Form
  toastMessage={store ? "Updated Store" : "Created Store"}
  submitButtonTitle={`${store ? "Update" : "Create"} Store`}
  remote={store ? formUpdateProject : formCreateProject}
  onSuccess={invalidate}
  className="space-y-5"
>
  {#if store}
    <HiddenInput {...formUpdateProject.fields.id.as("hidden", store.id)} />
  {/if}
  <HiddenInput {...formCreateProject.fields.workspaceId.as("hidden", workspaceId)} />
  <Input
    {...formCreateProject.fields.name.as("text")}
    value={store?.name}
    label="Name"
    placeholder="Name"
    required
  />
  <Textarea
    {...formCreateProject.fields.description.as("text")}
    value={store?.description}
    label="Description"
    placeholder="Description"
    required
  />
</Form>
