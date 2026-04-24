<script lang='ts'>
	import Claude from "$lib/components/icons/Claude.svelte";
	import Codex from "$lib/components/icons/Codex.svelte";
	import Discord from "$lib/components/icons/Discord.svelte";
	import Gemini from "$lib/components/icons/Gemini.svelte";
	import Github from "$lib/components/icons/Github.svelte";
	import Npm from "$lib/components/icons/Npm.svelte";
	import Opencode from "$lib/components/icons/Opencode.svelte";
	import Button from "$lib/components/common/Button.svelte";
	import { animate } from "motion";
	import { onDestroy, onMount } from "svelte";

	const agents = [
		{ label: "Claude Code", icon: "claude" },
		{ label: "Codex", icon: "codex" },
		{ label: "OpenCode", icon: "opencode" },
		{ label: "Gemini CLI", icon: "gemini" },
		{ label: "GitHub Copilot", icon: "github" },
	];
	let currentIndex = 0;
	let rotationTimer: ReturnType<typeof setTimeout>;
    function animateAgents(element: HTMLElement) {
	    animate(
			element,
			{
				opacity: [0, 1],
				transform: ["translateY(6px)", "translateY(0px)"],
				filter: ["blur(2px)", "blur(0px)"],
			},
			{
				duration: 0.35,
				ease: "easeOut",
			},
		);

		return {
			destroy() {},
		};
    }

	onMount(() => {
		rotationTimer = setInterval(() => {
			currentIndex = (currentIndex + 1) % agents.length;
		}, 3500);
	});

	onDestroy(() => {
		clearInterval(rotationTimer);
	});

	const iconMapper = {
		claude,
		codex,
		opencode,
		gemini,
		github,
	};
</script>

{#snippet claude()}
	<Claude size={20} />
{/snippet}
{#snippet codex()}
	<Codex size={20} />
{/snippet}
{#snippet opencode()}
	<Opencode size={20} />
{/snippet}
{#snippet gemini()}
	<Gemini size={20} />
{/snippet}
{#snippet github()}
	<Github size={20} />
{/snippet}

<section class="space-y-3 text-center py-14">
	<h1 class="text-2xl font-semibold text-black inline-flex items-center justify-center gap-2">
		<span>Help</span>
		<div
			class="h-12 border bg-white text-xl border-gray-300 px-4 shadow-sm shadow-gray-100 flex items-center justify-center rounded-full w-fit"
			aria-live="polite"
		>
			{#key agents[currentIndex].label}
				<span use:animateAgents class="inline-flex items-center gap-2">
					{@render iconMapper[agents[currentIndex].icon as keyof typeof iconMapper]()}
					{agents[currentIndex].label}
				</span>
			{/key}
		</div>
		<span>stay up to date</span>
	</h1>
    <p>The open-source context layer for the agenetic era</p>
	<div class="flex items-center justify-center space-x-5">
		<a href="https://github.com/barque-ai" target="_blank" rel="noreferrer">
            <div class="space-x-2 flex items-center">
                <Github size={18} />
                <span class="font-medium text-black">Github</span>
            </div>
        </a>
		<a href="https://www.npmjs.com/package/@barque/cli" target="_blank" rel="noreferrer">
            <div class="space-x-2 flex items-center">
                <Npm size={18} />
                <span class="font-medium text-black">NPM</span>
            </div>
        </a>
		<a href="https://discord.com" target="_blank" rel="noreferrer">
            <div class="space-x-2 flex items-center">
                <Discord size={18} />
                <span class="font-medium text-black">Discord</span>
            </div>
        </a>
    </div>
</section>
<section class="space-y-10">
    <div class="space-y-3">
        <h2 class="text-xl text-black font-semibold">What is Compeer?</h2>
        <p>Compeer is an open-source, fast context layer for agents. It stores your store knowledge as captures, makes it searchable, and keeps usage history so agents always have the right context.</p>
		<a href="/docs/quickstart">
			<Button>Learn More</Button>
		</a>
    </div>
    <div class="space-y-3">
        <h2 class="text-xl text-black font-semibold">Gather Context From Everywhere</h2>
        <p>Add text, data, or websites. Compeer can scrape content, embed it locally, and return the most relevant context so answers stay grounded.</p>
		<a href="/docs/quickstart">
			<Button>Learn More</Button>
		</a>
    </div>
    <div class="space-y-3">
        <h2 class="text-xl text-black font-semibold">Connect to any Agent</h2>
        <p>Use the HTTP API, CLI, or our MCP server to connect any agent. Search across stores, pull the best captures, and share context across your tools.</p>
		<a href="/docs/quickstart">
			<Button>Learn More</Button>
		</a>
    </div>
    <div class="space-y-3">
        <h2 class="text-xl text-black font-semibold">Easy to Setup</h2>
        <p>Runs with a local SQLite database and a single Bun build. Docker support keeps deployment simple and fast, with minimal configuration.</p>
		<a href="/docs/quickstart">
			<Button>Learn More</Button>
		</a>
    </div>
    <div class="space-y-3">
        <h2 class="text-xl text-black font-semibold">Get Involved</h2>
        <p>Found a bug? File it on <a href="https://github.com/barque-ai" class="underline text-black">Github</a>. Have some ideas or want to share how you're using Compeer? Join our <a href="https://discord.com" class="underline text-black">Discord</a>.</p>
    </div>
</section>
