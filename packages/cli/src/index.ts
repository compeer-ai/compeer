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
import { workspacesCommand } from "./commands/workspaces";
import { mcpCommand } from "./commands/mcp";

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
      workspacesCommand,
      mcpCommand,
    ],
    {
      name: "compeer",
      description: "CLI for Compeer",
      argSource: ["bun", "compeer", ...ARGS],
      hook: async (event, command) => {
        if (event === "before" && command.name !== 'init') {
          const currentConfig = await config.safeRead();
          try {
            await fetch(
              new URL(
                `/api/v1/alive`,
                currentConfig?.server || "http://localhost:5173",
              ),
            );
          } catch {
            console.error("Compeer server is not currently online");
            process.exit(1);
          }

          if (!currentConfig) {
            console.error("Compeer is not yet initialized for this project");
            process.exit(1);
          } else {
            await agent.setup(currentConfig.agent);
          }
        }
      },
    },
  );
})();
