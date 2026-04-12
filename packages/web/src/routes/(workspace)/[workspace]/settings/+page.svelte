<script lang='ts'>
    import { animations } from "$lib/utilities/animations";
    import Card from "$lib/components/common/Card.svelte";
	import WorkspaceForm from "$lib/components/forms/WorkspaceForm.svelte";
	import { deleteWorkspace, readWorkspace } from "$lib/remotes/workspace.remote";
	import { page } from "$app/state";
	import DeleteForm from "$lib/components/forms/DeleteForm.svelte";
	import { goto } from "$app/navigation";

    const workspace = readWorkspace({
        name: page.params.workspace!!
    });
    const invalidate = () => workspace.refresh()
</script>

{#if workspace.ready}
<section class="space-y-5 p-7" use:animations.fadeInForward>
  <h1 class="text-xl font-semibold text-black">Workspace Settings</h1>
    <Card title="Metadata" collaspable>
        <div class="p-5">
            <WorkspaceForm  workspace={workspace.current} {invalidate} />
        </div>
    </Card>
    <Card title="Danger Zone" collaspable>
        <div class="space-y-3 p-5">
            <p>
            This deletes all project contents, including all captures. This action
            cannot be reversed.
            </p>
            <DeleteForm remote={deleteWorkspace} toastMessage="Deleted Workspace" onSuccess={() => goto('/')} id={workspace.current.id} />
        </div>
    </Card>
</section>
{/if}