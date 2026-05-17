<script lang='ts'>
	import { readDoc } from "$lib/remotes/doc.remote";
	import { page } from "$app/state";
	import { clipboard } from "$lib/utilities/clipboard";
	import { Copy } from "@lucide/svelte";
	import Icon from "$lib/components/common/Icon.svelte";
	import { dispatcher } from "$lib/utilities/dispatcher";
	import { type Toast } from "$lib/models/toast";
	import Meta from "$lib/components/common/Meta.svelte";
    
    const doc = $derived(await readDoc({ slug: page.params.docsSlug!! }));
</script>

<Meta
	title="Compeer Docs: {doc.title}"
	description={doc.description}
    type="article"
/>
<article class='space-y-5 w-full'>
    <section class='space-y-3'>
		<button
			class="text-black ml-auto flex space-x-2 items-center border border-gray-300 hover:bg-gray-100/30 transition ease-in-out bg-white shadow-sm shadow-gray-100 h-10 rounded-lg px-3"
			use:clipboard.copy={{ text: doc.markdown, onSuccess: () => {
                dispatcher.sendState<Toast>('toast', {
                    level: 'success',
                    message: 'Copied as Markdown',
                    id: Date.now()
                })
            } }}>
            <Icon icon={Copy}  />
            <span>               
                Copy as Markdown
            </span>
        </button>
        <h1 class='text-2xl font-semibold text-black'>{doc.title}</h1>
        <p>{doc.description}</p>
    </section>
    <section class="prose max-w-none w-full">
        {@html doc.content}
    </section>
</article>
