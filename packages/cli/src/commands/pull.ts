import { command, positional } from "@drizzle-team/brocli";
import { backend } from "../utilities/backend";
import { config } from "../utilities/config";
import { skill } from "../utilities/skill";

export const pull = command({
  name: "pull",
  desc: "Pull bases",
  aliases: ["pl"],
  transform: async (opts) => {
    const currentConfig = await config.read();
    return { ...currentConfig, ...opts };
  },
  handler: async (opts) => {
    const { workspace } = opts;
    try {
      const result = await backend.client.api.v1[":workspace"].projects.$get({
        param: {
          workspace,
        },
      });
      if (result.ok) {
        const json = await result.json();
        await skill.syncAll(opts.agent!!, json);
        console.log(`Pulled ${json.length} projects`);
        return;
      }
      console.error(
        `Failed to pull:`,
        JSON.stringify({
          status: result.status,
          statusText: result.statusText,
        }),
      );
      process.exit(1);
    } catch (error) {
      console.error("System error occured", (error as Error).message);
      process.exit(1);
    }
  },
});
