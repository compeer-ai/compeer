#!/usr/bin/env bun
import { run } from "@drizzle-team/brocli";
import { captureCommand } from "./commands/capture";
import { searchCommand } from "./commands/search";
import { storesCommand } from "./commands/stores";
import { config } from "./utilities/config";
import { agent } from "./utilities/agent";
import { pullCommand } from "./commands/pull";
import { webCommand } from "./commands/web";

(async () => {
  const ARGS = process.argv.slice(2);
  const currentConfig = await config.safeRead();
  if (!currentConfig) {
    console.error("Compeer is not yet configured");
    process.exit(1);
  } else {
    await agent.setup(currentConfig.agent);
  }

  try {
    await fetch(currentConfig.server);
  } catch {
    console.error("Compeer server is not currently alive");
    process.exit(1);
  }
  run([captureCommand, searchCommand, storesCommand, pullCommand, webCommand], {
    name: "compeer",
    description: "CLI for Compeer",
    argSource: ["bun", "compeer", ...ARGS],
  });
})();
