#!/usr/bin/env bun
import { run } from "@drizzle-team/brocli";
import { captureCommand } from "./commands/capture";
import { searchCommand } from "./commands/search";
import { storesCommand } from "./commands/stores";
import { config } from "./utilities/config";
import { agent } from "./utilities/agent";
import { pullCommand } from "./commands/pull";
import { webCommand } from "./commands/web";
import { initCommand } from "./commands/init";

(async () => {
  const ARGS = process.argv.slice(2);

  run(
    [
      initCommand,
      captureCommand,
      searchCommand,
      storesCommand,
      pullCommand,
      webCommand,
    ],
    {
      name: "compeer",
      description: "CLI for Compeer",
      argSource: ["bun", "compeer", ...ARGS],
      hook: async (event, command, globals) => {
        if (event === "before" && command.name !== "init") {
          const currentConfig = await config.safeRead();
          if (!currentConfig) {
            console.error("Compeer is not yet initilized for this project");
            process.exit(1);
          } else {
            await agent.setup(currentConfig.agent);
          }

          try {
            await fetch(new URL(`/api/v1/alive`, currentConfig.server));
          } catch {
            console.error("Compeer server is not currently online");
            process.exit(1);
          }
        }
      },
    },
  );
})();
