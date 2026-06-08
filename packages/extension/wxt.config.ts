import { defineConfig } from "wxt";

export default defineConfig({
  modules: ['@wxt-dev/auto-icons'],
  manifest: {
    name: "Compeer",
    version: "0.3.0",
    description: "Capture to Compeer on the fly",
    permissions: [
      'activeTab',
      'tabs',    
    ],
    host_permissions: [
      '<all_urls>',
    ],
  },
});
