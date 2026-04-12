import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const webClientPath = path.resolve(
  rootDir,
  "../web/src/lib/utilities/client.ts",
);

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-svelte", "@wxt-dev/auto-icons"],
  manifest: {
    permissions: [
      "contextMenus",
      "storage",
      "sidePanel",
      "activeTab",
      "scripting",
    ],
  },
  vite: () => ({
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@web/client": webClientPath,
      },
    },
  }),
});
