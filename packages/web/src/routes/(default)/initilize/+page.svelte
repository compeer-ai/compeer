<script lang='ts'>
	import { readJwt } from "$lib/remotes/jwt.remote";
	import { readWorkspaces } from "$lib/remotes/workspace.remote";
	
    let { data } = $props();

    const Step = {
        workspace: 0,
        agent: 1,
    } as const;
    const workspaces = readWorkspaces();
    const jwt = readJwt();
    const agents = [
        {
            title: 'Claude Code',
            value: 'claude-code'
        },
        {
            title: 'Codex',
            value: 'codex'
        },
        {
            title: 'OpenCode',
            value: 'opencode'
        },
        {
            title: 'Gemini CLI',
            value: 'gemini-cli'
        },
        {
            title: 'GitHub Copilot',
            value: 'github-copilot'
        }
    ] 
    let step = $state<number>(Step.workspace)
    let workspace = $state<string>();
</script>

{#snippet selection<T extends { title: string, value: string }>(args: { items: T[], onSelect: (item: T) => void})}
    <div class="border divide-y divide-gray-300 border-gray-300 rounded-lg shadow-sm shadow-gray-100">
        {#each args.items as item}
            <button class="py-4 flex px-5 w-full hover:bg-gray-100/30 transition ease-in-out">
                {item.title}
            </button>
        {/each}
    </div>
{/snippet}
{#if workspaces.ready && jwt.ready}
    {#if step == Step.workspace}
        {@const items = workspaces.current.map((workspace) => ({ title: workspace.name, value: workspace.id }))}
        <section class="space-y-3">
            <h1 class="text-xl font-semibold text-black">Select a Workspace</h1>
            {@render selection({ items, onSelect: (selectedWorkspace) =>{
                workspace = selectedWorkspace.value;
                step = Step.agent;
            }})}
        </section>
    {/if}
    {#if step == Step.agent}
        <section class="space-y-3">
            <h1 class="text-xl font-semibold text-black">Select a Agent</h1>
            {@render selection({ items: agents, onSelect: (selectedAgent) =>{
                const url = new URL(`?jwt=${jwt}&workspace=${workspace}&agent=${selectedAgent.value}`, data.redirectUri)
                window.location.href = url.toString()
            }})}
        </section>
    {/if}
{/if}