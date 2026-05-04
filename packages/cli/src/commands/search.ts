import { boolean, command, positional, string } from "@drizzle-team/brocli";
import { backend } from "../utilities/backend";
import { config } from "../utilities/config";

export const searchCommand = command({
  name: "search",
  desc: "Search store captures",
  aliases: ["s"],
  options: {
    workspace: positional("workspace").desc("Name of workspace").required(),
    store: positional("store").desc("Name of store").required(),
    query: string("query").desc("Search query").required(),
    pretty: boolean().default(false),
  },
  transform: async (opts) => {
    const currentConfig = await config.read();
    return { ...currentConfig, ...opts };
  },
  handler: async (opts) => {
    const { workspace, query, store, jwt } = opts;
    try {
      const client = backend.client(opts.server, jwt);
      const result = await client[":workspace"].search.$get({
        param: {
          workspace,
        },
        query: { query, store },
      });
      if (result.ok) {
        const json = await result.json();
        const content = json.map((item) => item.content);
        opts.pretty ? console.table(content) : console.log(JSON.stringify(content));
        return;
      }
      console.error(
        `Failed to read captures:`,
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
