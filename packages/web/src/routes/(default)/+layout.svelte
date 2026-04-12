<script lang='ts'>
	import Sidebar from "$lib/components/common/Sidebar.svelte";
	import { readTheme } from "$lib/remotes/config.remote";
	import type { LayoutProps } from "../$types";
    const { children}: LayoutProps = $props()
    const theme = readTheme();
   
</script>

    <div class="flex">
<Sidebar />
<div    class="h-screen w-full overflow-y-auto border-l border-gray-300"
        style={`background-color: #fff;
background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.07' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");`}
     >

{@render children()}
</div>
</div>  
