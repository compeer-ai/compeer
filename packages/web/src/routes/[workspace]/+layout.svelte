<script lang="ts">
  import "../../app.css";
  import type { LayoutProps } from "./$types";
  import { readProjects } from "$lib/remotes/store.remote";
  import { onMount, type Snippet } from "svelte";
  import Drawer from "$lib/components/common/Drawer.svelte";
  import Modal from "$lib/components/common/Modal.svelte";
  import Toast from "$lib/components/common/Toast.svelte";
  import { type Toast as IToast } from "$lib/models/toast";
  import { dispatcher } from "$lib/utilities/dispatcher";
  import { readTheme } from "$lib/remotes/config.remote";
  import Sidebar from "$lib/components/common/Sidebar.svelte";
	import { readWorkspace } from "$lib/remotes/workspace.remote";
	import { page } from "$app/state";
	
  const { children }: LayoutProps = $props();

  const workspace = readWorkspace({
    name: page.params.workspace!!
  })
  const projects = $derived.by(() => workspace.current && readProjects({
    workspaceId: workspace.current.id
  }));
  const theme = readTheme()
  let drawer = $state<Snippet | null>(null);
  let drawerExpanded = $state<Snippet | null>();
  let modal = $state<Snippet | null>(null);
  let snippet = $state<Snippet | null>();
  let toast = $state<IToast | null>(null);
  onMount(() => {
    function handleDrawer(e: CustomEvent<{ snippet: Snippet }>) {
      drawer = e.detail.snippet;
    }
    function handleModal(e: CustomEvent<{ snippet: Snippet }>) {
      modal = e.detail.snippet;
    }
    function handleDrawerExtended(e: CustomEvent<{ snippet: Snippet }>) {
      drawerExpanded = e.detail.snippet;
    }
    function handleToast(e: CustomEvent<IToast>) {
      toast = e.detail;
    }
    function handleSnippet(e: CustomEvent<{ snippet: Snippet }>) {
      snippet = e.detail.snippet;
    }
    function handleCloseDrawer() {
      drawerExpanded = null;
      drawer = null;
    }
    function handleCloseSnippet() {
      snippet = null;
    }
    function handleCloseModal() {
      modal = null;
    }
    const offDrawer = dispatcher.listen("drawer", handleDrawer);
    const offToast = dispatcher.listen("toast", handleToast);
    const offSnippet = dispatcher.listen("snippet", handleSnippet);
    const offCloseSnippet = dispatcher.listen(
      "closeSnippet",
      handleCloseSnippet,
    );
    const offDrawerExpanded = dispatcher.listen(
      "drawer-expanded",
      handleDrawerExtended,
    );
    const offCloseDrawer = dispatcher.listen("closeDrawer", handleCloseDrawer);
    const offCloseModal = dispatcher.listen("closeModal", handleCloseModal);
    const offModal = dispatcher.listen("modal", handleModal);
    return () => {
      offDrawer();
      offToast();
      offDrawerExpanded();
      offModal();
      offCloseDrawer();
      offCloseModal();
      offCloseSnippet();
      offSnippet();
    };
  });
</script>

{#if projects?.ready && theme.ready}
<main data-theme={theme.current}>
    <div class="flex">
      <Sidebar />
      <div
        class="h-screen w-full overflow-y-auto border-l border-gray-300"
        style={`background-color: #fff;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.07' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");`}
      >
        {@render children()}
      </div>
    </div>
    {#if modal}
      <Modal
        handleClose={() => {
          modal = null;
        }}
      >
        {@render modal()}
      </Modal>
    {/if}
    {#if drawer}
      <Drawer
        handleClose={() => {
          drawer = null;
        }}
      >
        {@render drawer()}
      </Drawer>
    {/if}
    {#if drawerExpanded}
      <Drawer
        handleClose={() => {
          drawerExpanded = null;
        }}
        expanded
      >
        {@render drawerExpanded()}
      </Drawer>
    {/if}
    {#if toast}
      {#key toast.id}
        <Toast {toast} />
      {/key}
    {/if}
    {#if snippet}
      {@render snippet()}
    {/if}
  </main>
  
{/if}
