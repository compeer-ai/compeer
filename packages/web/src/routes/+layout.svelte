<script lang='ts'>
	import { dispatcher } from "$lib/utilities/dispatcher";
	import { onMount, type Snippet } from "svelte";
    import { type Toast as IToast } from "$lib/models/toast";
	import Drawer from "$lib/components/common/Drawer.svelte";
	import Modal from "$lib/components/common/Modal.svelte";
	import Toast from "$lib/components/common/Toast.svelte";
	import type { LayoutProps } from "./$types";
  import "../app.css";
	import { readTheme } from "$lib/remotes/config.remote";


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
        const offCloseSnippet = dispatcher.listen("closeSnippet", handleCloseSnippet);
        const offDrawerExpanded = dispatcher.listen("drawer-expanded", handleDrawerExtended);
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
    const { children }: LayoutProps = $props()
    const theme = readTheme();
</script>

{#if theme.ready}
<main data-theme={theme.current}>
    {@render children()}
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