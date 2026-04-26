<script lang='ts'>
	import Icon from "$lib/components/common/Icon.svelte";
	import { readJwt } from "$lib/remotes/jwt.remote";
	import { readWorkspaces } from "$lib/remotes/workspace.remote";
	import { animations } from "$lib/utilities/animations.js";
	import { Check } from "@lucide/svelte";
	
    let { data } = $props();

    const Step = {
        workspace: 0,
        agent: 1,
        end: 2
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
            <button class="py-4 flex px-5 w-full hover:bg-gray-100/30 transition ease-in-out" onclick={() => args.onSelect(item)}>
                {item.title}
            </button>
        {/each}
    </div>
{/snippet}
{#if workspaces.ready && jwt.ready}
    {#if step == Step.workspace}
        {@const items = workspaces.current.map((workspace) => ({ title: workspace.name, value: workspace.name }))}
        <section class="space-y-3" use:animations.fadeInForward>
            <h1 class="text-lg font-semibold text-black">Select a Workspace</h1>
            {@render selection({ items, onSelect: (selectedWorkspace) =>{
                workspace = selectedWorkspace.value;
                step = Step.agent;
            }})}
        </section>
    {/if}
    {#if step == Step.agent}
        <section class="space-y-3" use:animations.fadeInForward>
            <h1 class="text-xl font-semibold text-black">Select a Agent</h1>
            {@render selection({ items: agents, onSelect: async (selectedAgent) =>{
                const url = new URL(`?jwt=${jwt.current}&workspace=${workspace}&agent=${selectedAgent.value}`, data.redirectUri)
                await fetch(url);
                step = Step.end
            }})}
        </section>
    {/if}
    {#if step == Step.end}
        <section class="h-[calc(100vh-68.67px-28px-28px)] flex justify-center items-center" use:animations.fadeInForward>
            <div class="flex flex-col items-center space-y-2">
                <div class="flex space-x-2 items-center">
                    <div class="h-8 w-8 flex items-center justify-center bg-green-700 text-white rounded-full">
                        <Icon icon={Check} size={18}/>
                    </div>
                    <span class="text-black font-semibold text-lg">All done</span>
                </div>
                <span>You can return back to your terminal now</span>
            </div>
        </section>
    {/if}
{/if}