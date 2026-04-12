import adapter from 'svelte-adapter-bun';

const config = {
	kit: {
		adapter: adapter(),
		experimental: {
			tracing: {
				server: true
			},
			instrumentation: {
				server: true
			},
			remoteFunctions: true
		}
	},
	compilerOptions: {
		experimental: {
			async: true
		}
	}
};

export default config;
