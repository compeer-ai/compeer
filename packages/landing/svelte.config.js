import adapter from '@sveltejs/adapter-static';
import { mdsvex } from "mdsvex";

const config = {
  preprocess: [
    mdsvex({
      extensions: [".md", ".svx"],
    }),
  ],
  kit: {
    adapter: adapter(),
    experimental: {
      tracing: {
        server: true,
      },
      instrumentation: {
        server: true,
      },
      remoteFunctions: true,
    },
  },
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
};

export default config;
