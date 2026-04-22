<script lang="ts">
  import Card from "$lib/components/common/Card.svelte";
  import { animations } from "$lib/utilities/animations";
  import Metadata from "$lib/components/common/Metadata.svelte";
  import ProjectForm from "$lib/components/forms/ProjectForm.svelte";
  import { commandExportProject, formDeleteProject, readStore, readStores } from "$lib/remotes/store.remote";
  import { page } from "$app/state";
  import { goto } from "$app/navigation";
  import DeleteForm from "$lib/components/forms/DeleteForm.svelte";
	import { readWorkspace } from "$lib/remotes/workspace.remote";
	import Button from "$lib/components/common/Button.svelte";
	import { download } from "$lib/utilities/download";
	import Input from "$lib/components/common/Input.svelte";
  import { config } from "$lib/utilities/config";

  const workspace = $derived(readWorkspace({
    name: page.params.workspace!!
  }));
  const store = $derived(readStore({
    id: page.params.storeId!!
  }));

  const updateInvalidate = () => store.refresh();
  const deleteInvalidate = () => workspace.current && readStores({ workspaceId: workspace.current?.id }).refresh()
</script>

<Metadata title="Barque: Store Settings" description="Give AI eyes" />
{#if store.ready && workspace.ready}
  <section
    class="space-y-5 p-7 h-screen-minus-header overflow-y-auto"
    use:animations.fadeInForward
  >
    {#if config.flags.updateProjects}
      <Card title="Update Store" collaspable>
        <div class="space-y-3 p-5">
          <ProjectForm store={store.current} workspaceId={workspace.current.id} invalidate={updateInvalidate} />
        </div>
      </Card>
    {/if}
    {#if config.flags.configureProjectMcps}
      <Card title="Configure MCP" collaspable>
        <div class="space-y-3 p-5">
          <Input label='URL' name="url" placeholder="URL" value={`${page.url.origin}/workspace/${workspace.current.name}/store/${store.current.id}/mcp`} />
        </div>
      </Card>
    {/if}
    {#if config.flags.exportProjects}
      <Card title="Export Store" collaspable>
        <div class="p-5">
          <Button variant='wide' onclick={async () => {
            const backup = await commandExportProject({ id: page.params.storeId!! });
            download.start(backup, `${store.current.name}_backup.barque`)
          }}>
            Export
          </Button>
        </div>
      </Card>
    {/if}
    {#if config.flags.deleteProjects}
      <Card title="Delete Store" collaspable>
        <div class="space-y-3 p-5">
          <p>
            This deletes all workspace contents, including all captures. This action
            cannot be reversed.
          </p>
          <DeleteForm
            id={page.params.storeId!!}
            toastMessage={"Deleted Store"}
            remote={formDeleteProject}
            onSuccess={async () => {
              await deleteInvalidate();
              goto(`/${workspace.current.name}`);
            }}
          />
        </div>
      </Card>
    {/if}
  </section>
{/if}