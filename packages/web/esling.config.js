import eslintPluginSvelte from 'eslint-plugin-svelte';

export default [
	// Generic JS recommended rules
	// js.configs.recommended, // Uncomment if you have 'eslint/js' installed and configured

	// Svelte recommended rules
	...eslintPluginSvelte.configs.recommended,
	{
		files: ['**/*.svelte'],
		// Add additional configurations specific to Svelte files
		languageOptions: {
			parserOptions: {
				// Specify SvelteKit-related settings if needed
				// svelteConfig: './svelte.config.js'
			}
		}
	},
	{
		// Override or add specific rules
		rules: {
			// 'svelte/rule-name': 'error'
		}
	}
];
