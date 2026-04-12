import { boolean, command, positional, string } from "@drizzle-team/brocli";
import { backend } from "../utilities/backend";
import { config } from "../utilities/config";

export const search = command({
  name: "search",
  desc: "Search project captures",
  aliases: ["s"],
  options: {
    query: positional("query").desc("Search query").required(),
    project: string("project").desc("Project"),
    pretty: boolean().default(false),
  },
  transform: async (opts) => {
    const currentConfig = await config.read();
    return { ...currentConfig, ...opts };
  },
  handler: async (opts) => {
    const { workspace, query, project } = opts;
    try {
      const result = await backend.client.api.v1[":workspace"].search.$get({
        param: {
          workspace,
        },
        query: { query, project },
      });
      if (result.ok) {
        const json = await result.json();
        opts.pretty ? console.table(json) : console.log(JSON.stringify(json));
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
