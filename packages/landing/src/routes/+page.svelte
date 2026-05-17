<script lang='ts'>
	import Claude from "$lib/components/icons/Claude.svelte";
	import Codex from "$lib/components/icons/Codex.svelte";
	import Discord from "$lib/components/icons/Discord.svelte";
	import Gemini from "$lib/components/icons/Gemini.svelte";
	import Github from "$lib/components/icons/Github.svelte";
	import Npm from "$lib/components/icons/Npm.svelte";
	import Opencode from "$lib/components/icons/Opencode.svelte";
	import Button from "$lib/components/common/Button.svelte";
	import Meta from "$lib/components/common/Meta.svelte";
	import { animate } from "motion";
	import { onDestroy, onMount } from "svelte";
	import { ArrowRightLeft, Blocks, Boxes, Cable, Code, Lock, Share2 } from "@lucide/svelte";
	import Icon from "$lib/components/common/Icon.svelte";

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

<Meta
	title="Compeer: The open-source context layer for the agenetic era"
	description="Compeer is knowledge transfer for your AI coding assistant. Increase your agent's performance and save tokens."
/>

<main>
<section class="space-y-3 text-center py-14">
	<h1 class="text-2xl font-semibold text-black flex md:flex-row flex-col items-center justify-center gap-2">
		<div class="flex items-center gap-2"> 
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
		</div>
		<span>stay up to date</span>
	</h1>
    <p>The open-source context layer for the agenetic era.</p>
	<div class="flex items-center justify-center space-x-5">
		<a href="https://github.com/compeer-ai" target="_blank" rel="noreferrer">
            <div class="space-x-2 flex items-center">
                <Github size={18} />
                <span class="font-medium text-black">GitHub</span>
            </div>
        </a>
		<a href="https://www.npmjs.com/org/compeer-ai" target="_blank" rel="noreferrer">
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
<section class="py-7 flex items-center">
	<div class="text-center space-y-2 w-full">
		<h2 class="text-black text-lg font-semibold">Agents Need Our Help</h2>
		<p>Everytime you spawn a new session with your coding assistant, it has to learn. <span class="text-black font-medium">Compeer is knowledge transfer for your agent.</span> Humans need it. Agents do too. Increase your agent's performance and save tokens.</p>
	</div>
</section>
<section class="py-7 space-y-7">
	<div class="text-center space-y-2 w-full">
		<h2 class="text-black text-lg font-semibold">See what's possible</h2>
		<p>Compeer is more than just context for your agents.</p>
	</div>
	<div class="md:grid-cols-3 grid-cols-1 grid gap-4">
		<div class="p-5 border border-gray-300 rounded-lg space-y-3 bg-white shadow-gray-100 shadow-sm">
		<div class="space-x-2 flex items-center text-black">
			<Icon icon={ArrowRightLeft} size={18} />
			<h3 class="font-medium">Bidirectional Context</h3>
		</div>
		<p>Compeer allows your coding assistant to capture data into it's memory for future use or for other agents to use.</p>
		<a href="/docs/quickstart">
			<Button>Get Started</Button>
		</a>
	</div>
		<div class="p-5 border border-gray-300 rounded-lg space-y-3 bg-white shadow-gray-100 shadow-sm">
		<div class="space-x-2 flex items-center text-black">
			<Icon icon={Blocks} size={18} />
			<h3 class="font-medium">Multiple Modalities</h3>
		</div>		
		<p>Conveniently curate data for your coding assistant via your browser, CLI, API, and more.

		</p>
		<a href="/docs/quickstart">
				<Button>Get Started</Button>
		</a>
	</div>
		<div class="p-5 border border-gray-300 rounded-lg space-y-3 bg-white shadow-gray-100 shadow-sm">
	<div class="space-x-2 flex items-center text-black">
			<Icon icon={Share2} size={18} />
			<h3 class="font-medium">Collaboration</h3>
		</div>					
		<p>Compeer can hosted for team-use, allowing everyone to contribute context and expose it for others to use.</p>
		<a href="/docs/quickstart">
				<Button>Get Started</Button>
		</a>
	</div>
		<div class="p-5 border border-gray-300 rounded-lg space-y-3 bg-white shadow-gray-100 shadow-sm">
<div class="space-x-2 flex items-center text-black">
			<Icon icon={Cable} size={18} />
			<h3 class="font-medium">Interporability</h3>
		</div>			
		<p>Coding agents don't have to be the only user of your context. You can expose your context to custom agentic applications.</p>
		<a href="/docs/quickstart">
				<Button>Get Started</Button>
		</a>
	</div>
		<div class="p-5 border border-gray-300 rounded-lg space-y-3 bg-white shadow-gray-100 shadow-sm">
<div class="space-x-2 flex items-center text-black">
			<Icon icon={Code} size={18} />
			<h3 class="font-medium">SDKs</h3>
		</div>		
		<p>Use our Python and Typescript SDKs to enable your internal applications to integrate with Compeer.</p>
		<a href="/docs/quickstart">
				<Button>Get Started</Button>
		</a>
	</div>
		<div class="p-5 border border-gray-300 rounded-lg space-y-3 bg-white shadow-gray-100 shadow-sm">
<div class="space-x-2 flex items-center text-black">
			<Icon icon={Lock} size={18} />
			<h3 class="font-medium">Entreprise Ready</h3>
		</div>			
		<p>Compeer has granular configuration controls and intregation with OIDC authentication for entreprise level use.</p>
		<a href="/docs/quickstart">
				<Button>Get Started</Button>
		</a>
	</div>

	</div>
</section>
<section class="py-7 space-y-7">
	<div class="text-center space-y-2 w-full">
		<h2 class="text-black text-lg font-semibold">Start Building</h2>
		<p>Compeer is batteries included. Start making stries today.</p>
	</div>
	<div class="grid md:grid-cols-3 grid-cols-1 gap-5">
		<div class="p-5 border border-gray-300 rounded-lg space-y-3 bg-white shadow-gray-100 shadow-sm">
			<h3 class="font-medium text-black">CLI</h3>
			<p>
				<span class="text-black">For your Agent.</span>
				 A CLI for your agent to get context and store its own context as it sees fit.</p>
				 <a href="/docs/cli">
					<Button>Learn More</Button>
				</a>

				</div>
		<div class="p-5 border border-gray-300 rounded-lg space-y-3 bg-white shadow-gray-100 shadow-sm">
			<h3 class="font-medium text-black">Web</h3>
			<p>	<span class="text-black">For your Team.</span>
				An interface for you and your team to capture text, data, and websites for your agents to learn from.
			</p>	
			<a href="/docs/web-application">
				<Button>Learn More</Button>
			</a>			

			</div>
		<div class="p-5 border border-gray-300 rounded-lg space-y-3 bg-white shadow-gray-100 shadow-sm">
			<h3 class="font-medium text-black">SDKs</h3>
			<p><span class="text-black">For your systems.</span>
			Abstractions for your to integrate Compeer with your greater agenetic infrastructure.
		</p>
		<a href="/docs/python-sdk">
			<Button>Learn More</Button>
		</a>
		</div>
	</div>
</section>
<section class="py-7 flex items-center">
	<div class="text-center space-y-2 w-full">
		<h2 class="text-black text-lg font-semibold">Join the Community</h2>
		<p>Let's grow this into something big! Follow us on <a href="https://github.com/compeer-ai" class="text-black underline">GitHub</a>, star our <a href="https://github.com/compeer-ai/compeer" class="text-black underline">repository</a>, or join us on <a href="https://github.com/compeer-ai/compeer/discussions" class="text-black underline">GitHub discussions</a> or <a href="https://discord.com" class="text-black underline">Discord</a>.</p>
	</div>
</section>
</main>
