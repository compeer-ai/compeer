<script lang='ts'>
	import { onMount, type Snippet } from "svelte";
    import "../app.css";
	import Header from "$lib/components/common/Header.svelte";
	import Footer from "$lib/components/common/Footer.svelte";
	import { dispatcher } from "$lib/utilities/dispatcher";
	import Drawer from "$lib/components/common/Drawer.svelte";
    import { type Toast as IToast } from "$lib/models/toast";
	import Toast from "$lib/components/common/Toast.svelte";

    interface Props {
        children: Snippet;
    }

    const { children }: Props = $props();
    let drawer = $state<Snippet | null>(null);
    let toast = $state<IToast | null>(null);
    onMount(() => {
        function handleDrawer(e: CustomEvent<{ snippet: Snippet }>) {
            drawer = e.detail.snippet;
        }
        function handleClear(e: CustomEvent<{ key: string }>) {
            if (e.detail.key === 'drawer') {
                drawer = null;
            }
        }
        function handleToast(e: CustomEvent<{ state: IToast}>) {
             toast = e.detail.state;
        }
        const offDrawer = dispatcher.listen("drawer", handleDrawer);
        const offClear = dispatcher.listen('clear', handleClear);
        const offToast = dispatcher.listen("toast", handleToast);
        return () => {
            offDrawer();
            offClear();
            offToast();
        };
    });
</script>

<main  style={`background-color: #fff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.07' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");`}
       >
    <Header />
    <div class="w-full min-h-[calc(100vh-(80.667px*2))] max-w-6xl mx-auto p-7" style={`background-color: #fff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.07' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");`}
        >
        {@render children()}
    </div>
    <Footer />
</main>
{#if drawer}
    <Drawer
        handleClose={() => {
            drawer = null;
        }}
    >
     {@render drawer()}
    </Drawer>
{/if}
{#if toast}
    {#key toast.id}
        <Toast {toast} />
    {/key}
{/if}