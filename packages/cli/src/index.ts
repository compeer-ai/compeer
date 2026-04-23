#!/usr/bin/env bun
import { run } from "@drizzle-team/brocli";
import { capture } from "./commands/capture";
import { search } from "./commands/search";
import { stores } from "./commands/stores";
import { config } from "./utilities/config";
import { agent } from "./utilities/agent";
import { pull } from "./commands/pull";
import { web } from "./commands/web";

const ARGS = process.argv.slice(2);

async function checkBarqueServer(server: string) {
  try {
    await fetch(server);
  } catch {
    console.error("Barque server is not configured");
    process.exit(1);
  }
}

run([capture, search, stores, pull, web], {
  name: "barque",
  description: "CLI for Barque",
  argSource: ["bun", "barque", ...ARGS],
  hook: async (event: "before" | "after") => {
    if (event === "before") {
      const currentConfig = await config.safeRead();
      if (!currentConfig) {
        console.error("Barque is not configured for this directory");
        process.exit(1);
      }
      if (currentConfig) {
        await agent.setup(currentConfig.agent);
        await checkBarqueServer(currentConfig.server);
      }
    }
  },
});
