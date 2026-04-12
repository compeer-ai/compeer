<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import Icon from './Icon.svelte';

	interface Props {
		label?: string;
		name: string;
		value: string | null;
		required?: boolean;
		options: Record<string, string>;
	}

	const { label, name, required, options, value, ...others }: Props = $props();
</script>

<div class="relative flex flex-col space-y-3">
	{#if label}
		<label for={name} class="font-medium text-black">
			{label}
			<span class="text-sm text-red-600"> {required ? '*' : ''}</span>
		</label>
	{/if}

	<div class="relative">
		<select
			{name}
			{required}
			{...others}
			class="h-12 w-full appearance-none rounded-lg border border-gray-300 px-3 pr-10 shadow-sm shadow-gray-100 focus:outline-0"
		>
			{#each Object.entries(options) as [val, text]}
				<option value={val} selected={val === value}>{text}</option>
			{/each}
		</select>
		<span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
			<Icon icon={ChevronDown} />
		</span>
	</div>
</div>
