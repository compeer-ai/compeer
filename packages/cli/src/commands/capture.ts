import { command, positional } from "@drizzle-team/brocli";
import { backend } from "../utilities/backend";

export const captureCommand = command({
  name: "capture",
  desc: "Capture content for a store",
  aliases: ["c"],
  options: {
    workspace: positional("workspace").desc("Name of workspace").required(),
    store: positional("store").desc("Name of the store").required(),
    content: positional("content").desc("Capture content").required(),
  },
  transform: (opts) => {
    try {
      new URL(opts.content);
      return { ...opts, type: "url" };
    } catch (_) {}
    try {
      JSON.parse(opts.content);
      return { ...opts, type: "data" };
    } catch (e) {
      console.log(e);
    }
    return { ...opts, type: "text" };
  },
  handler: async (opts) => {
    try {
      const result = await backend.client.api.v1[":workspace"].capture.$post({
        param: {
          workspace: opts.workspace,
        },
        json: {
          ...opts,
          type: opts.type as "data" | "url" | "text",
          store: opts.store,
        },
      });
      if (result.ok) {
        const typeMapper: Record<typeof opts.type, string> = {
          data: "Data",
          url: "Url",
          text: "Text",
        };
        console.log(`${typeMapper[opts.type]} captured successfully`);
        return;
      }
      console.error(
        "Failed to capture text:",
        JSON.stringify({
          status: result.status,
          statusText: result.statusText,
        }),
      );
      process.exit(1);
    } catch (error) {
      console.error("System error occured:", (error as Error).message);
      process.exit(1);
    }
  },
});
