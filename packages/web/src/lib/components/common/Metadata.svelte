<script lang="ts">
	interface Props {
		title: string;
		description?: string | null;
	}
	let { title, description }: Props = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	{#if description}
		<meta property="og:description" content={description} />
	{/if}
</svelte:head>
