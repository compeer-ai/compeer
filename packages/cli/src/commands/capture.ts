import { command, positional, string } from "@drizzle-team/brocli";
import { backend } from "../utilities/backend";

export const capture = command({
  name: "capture",
  desc: "Capture content for a store",
  aliases: ["c"],
  options: {
    store: string("store").desc("Name of the store").required(),
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
    } catch (_) {}
    return { ...opts, type: "text" };
  },
  handler: async (opts) => {
    try {
      const result = await backend.client.api.v1.capture.$post({
        json: {
          ...opts,
          type: opts.type as "data" | "url" | "text",
          storeId: opts.store,
        },
      });
      if (result.ok) {
        console.log(`${opts.type} captured successfully`);
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
