<script lang="ts">
  import Form from "../common/Form.svelte";
  import Input from "../common/Input.svelte";
  import type { Project } from "$lib/repository/projectRepository";
  import {
    formUpdateProject,
    formCreateProject,
  } from "$lib/remotes/project.remote";
  import HiddenInput from "../common/HiddenInput.svelte";
  import Textarea from "../common/Textarea.svelte";

  interface Props {
    project?: Project;
    workspaceId: string;
    invalidate: () => Promise<void>
  }

  const { project, workspaceId, invalidate }: Props = $props();
</script>

<Form
  toastMessage={project ? "Updated Project" : "Created Project"}
  submitButtonTitle={`${project ? "Update" : "Create"} Project`}
  remote={project ? formUpdateProject : formCreateProject}
  onSuccess={invalidate}
  className="space-y-5"
>
  {#if project}
    <HiddenInput {...formUpdateProject.fields.id.as("hidden", project.id)} />
  {/if}
  <HiddenInput {...formCreateProject.fields.workspaceId.as("hidden", workspaceId)} />
  <Input
    {...formCreateProject.fields.name.as("text")}
    value={project?.name}
    label="Name"
    placeholder="Name"
    required
  />
  <Textarea
    {...formCreateProject.fields.description.as("text")}
    value={project?.description}
    label="Description"
    placeholder="Description"
    required
  />
</Form>
