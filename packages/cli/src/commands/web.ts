import { boolean, command } from "@drizzle-team/brocli";
import { config } from "../utilities/config";
import { open } from "../utilities/open";

export const webCommand = command({
  name: "web",
  desc: "Web dashboard for Compeer workspace",
  aliases: ["w"],
  options: {
    pretty: boolean().default(false),
  },
  transform: async (opts) => {
    const currentConfig = await config.read();
    return { ...currentConfig, ...opts };
  },
  handler: async (opts) => {
    const url = new URL(`/${opts.workspace}`, opts.server);
    await open(url);
  },
});
