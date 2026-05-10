import adapter from '@sveltejs/adapter-static';
import { mdsvex } from "mdsvex";

const config = {
  preprocess: [
    mdsvex({
      extensions: [".md", ".svx"],
    }),
  ],
  kit: {
    prerender: {
      handleUnseenRoutes: 'warn'
    },
    adapter: adapter(),
    experimental: {
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
