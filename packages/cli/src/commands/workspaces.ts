import { command, boolean } from "@drizzle-team/brocli";
import { backend } from "../utilities/backend";
import { config } from "../utilities/config";

export const workspacesCommand = command({
  name: "workspaces",
  aliases: ["ws"],
  options: {
    pretty: boolean().default(false),
  },
  transform: async (opts) => {
    const currentConfig = await config.read();
    return { ...currentConfig, ...opts };
  },
  handler: async (opts) => {
    try {
      const { pretty } = opts;
      const response = await backend.client.api.v1.workspaces.$get();
      const workspaces = await response.json();
      if (pretty) {
        console.table(workspaces);
      } else {
        console.log(JSON.stringify(workspaces));
      }
    } catch (error) {
      console.error("System error occured", (error as Error).message);
      process.exit(1);
    }
  },
});
