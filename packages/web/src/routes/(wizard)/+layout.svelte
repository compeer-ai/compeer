<script lang='ts'>
	import Logo from "$lib/components/common/Logo.svelte";
    const { children } = $props()
</script>

<nav class="bg-white border-b border-gray-300">
    <header class="mx-auto max-x-7xl p-7">
        <a href="/">
            <Logo />
        </a>
    </header>
</nav>
    <main class='p-7'>
    <div    class="w-full"
            style={`background-color: #fff;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.07' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");`}
        >

    {@render children()}
    </div>

    </main>
