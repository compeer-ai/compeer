async function writeText(text: string): Promise<void> {
	await navigator.clipboard.writeText(text);
}

function copy(node: HTMLElement, args: { text: string; onSuccess?: () => void }) {
	let { text, onSuccess } = args;
	async function onClick() {
		await writeText(text);
		onSuccess?.();
	}

	node.addEventListener('click', onClick);

	return {
		update(nextArgs: { text: string; onSuccess?: () => void }) {
			text = nextArgs.text;
			onSuccess = nextArgs.onSuccess;
		},
		destroy() {
			node.removeEventListener('click', onClick);
		}
	};
}

export const clipboard = {
	copy,
	writeText
};
