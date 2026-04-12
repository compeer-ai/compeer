import { boolean, command } from "@drizzle-team/brocli";
import { config } from "../utilities/config";
import Bun from "bun";

async function openUrl(url: URL) {
  const urlString = url.toString();
  let command: string[];

  switch (process.platform) {
    case "darwin":
      command = ["open", urlString];
      break;
    case "win32":
      command = ["cmd", "/c", "start", "", urlString];
      break;
    default:
      command = ["xdg-open", urlString];
  }

  const processResult = Bun.spawn(command, {
    stdout: "ignore",
    stderr: "pipe",
  });
  const stderr = await new Response(processResult.stderr).text();
  const exitCode = await processResult.exited;

  if (exitCode !== 0) {
    console.error("Failed to open URL:", urlString);
    if (stderr.trim()) {
      console.error(stderr.trim());
    }
    process.exit(1);
  }
}

export const web = command({
  name: "web",
  desc: "Web dashboard for Barque workspace",
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
    await openUrl(url);
  },
});
