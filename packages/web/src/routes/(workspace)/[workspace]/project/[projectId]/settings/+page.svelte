<script lang="ts">
  import Card from "$lib/components/common/Card.svelte";
  import { animations } from "$lib/utilities/animations";
  import Metadata from "$lib/components/common/Metadata.svelte";
  import ProjectForm from "$lib/components/forms/ProjectForm.svelte";
  import { commandExportProject, formDeleteProject, readProject, readProjects } from "$lib/remotes/project.remote";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import DeleteForm from "$lib/components/forms/DeleteForm.svelte";
	import { readWorkspace } from "$lib/remotes/workspace.remote";
	import Button from "$lib/components/common/Button.svelte";
	import { download } from "$lib/utilities/download";
	import Input from "$lib/components/common/Input.svelte";

  const workspace = $derived(readWorkspace({
    name: page.params.workspace!!
  }));
  const project = $derived(readProject({
    id: page.params.projectId!!
  }));

  const updateInvalidate = () => project.refresh();
  const deleteInvalidate = () => workspace.current && readProjects({ workspaceId: workspace.current?.id }).refresh()
</script>

<Metadata title="Barque: Project Settings" description="Give AI eyes" />
{#if project.ready && workspace.ready}
  <section
    class="space-y-5 p-7 h-screen-minus-header overflow-y-auto"
    use:animations.fadeInForward
  >
    <Card title="Update Project" collaspable>
      <div class="space-y-3 p-5">
        <ProjectForm project={project.current} workspaceId={workspace.current.id} invalidate={updateInvalidate} />
      </div>
    </Card>
    <Card title="Configure MCP" collaspable>
      <div class="space-y-3 p-5">
        <Input label='URL' name="url" placeholder="URL" value={`${page.url.origin}/workspace/${workspace.current.name}/project/${project.current.id}/mcp`} />
      </div>
    </Card>
    <Card title="Export Project" collaspable>
      <div class="p-5">
        <Button variant='wide' onclick={async () => {
          const backup = await commandExportProject({ id: page.params.projectId!! });
          download.start(backup, `${project.current.name}_backup.barque`)
        }}>
          Export
        </Button>
      </div>
    </Card>
    <Card title="Delete Project" collaspable>
      <div class="space-y-3 p-5">
        <p>
          This deletes all project contents, including all captures. This action
          cannot be reversed.
        </p>
        <DeleteForm
          id={page.params.projectId!!}
          toastMessage={"Deleted Project"}
          remote={formDeleteProject}
          onSuccess={async () => {
            await deleteInvalidate();
            goto(`/${workspace.current.name}`);
          }}
        />
      </div>
    </Card>
  </section>
{/if}