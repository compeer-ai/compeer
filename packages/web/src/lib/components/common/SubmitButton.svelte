<script lang="ts">
	let { children } = $props();
</script>

<button
	type="submit"
	class="bg-primary hover:bg-secondary flex h-12 w-full cursor-pointer items-center justify-center rounded-lg text-white shadow-sm shadow-gray-100 transition ease-in-out"
>
	{@render children()}
</button>
