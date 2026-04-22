import { boolean, command } from "@drizzle-team/brocli";
import { backend } from "../utilities/backend";
import { config } from "../utilities/config";

export const stores = command({
  name: "stores",
  desc: "Get all stores",
  aliases: ["p"],
  options: {
    pretty: boolean().default(false),
  },
  transform: async (opts) => {
    const currentConfig = await config.read();
    return { ...currentConfig, ...opts };
  },
  handler: async (opts) => {
    const { pretty, workspace } = opts;
    try {
      const result = await backend.client.api.v1[":workspace"].stores.$get({
        param: {
          workspace,
        },
      });
      if (result.ok) {
        const json = await result.json();
        pretty ? console.table(json) : console.log(JSON.stringify(json));
        return;
      }
      console.error(
        `Failed to read stores:`,
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
