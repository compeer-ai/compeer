<script lang="ts">
	interface Props {
		selections: string[];
		handleSelect: (question?: string) => void;
	}

	let { handleSelect, selections }: Props = $props();
</script>

<div
	class="divide-y divide-gray-300 overflow-hidden rounded-lg border border-gray-300 shadow-sm shadow-gray-100"
>
	{#each selections as selection}
		<button
			class="w-full cursor-pointer px-5 py-4 text-left transition duration-150 ease-in-out hover:bg-gray-100/[.3]"
			onclick={() => handleSelect(selection)}
		>
			{selection}
		</button>
	{/each}
</div>
