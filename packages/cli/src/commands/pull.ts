import { command } from "@drizzle-team/brocli";
import { backend } from "../utilities/backend";
import { config } from "../utilities/config";
import { skill } from "../utilities/skill";
import type { Config } from "../models/config";
import { spinner } from "../utilities/spinner";
import yoctoSpinner from "yocto-spinner";

export async function pullCommandHanndler(opts: Config) {
  const { workspace, agent, jwt, server } = opts;
  try {
    const spinner = yoctoSpinner({ text: "Pulling stores" });
    spinner.start();
    const client = backend.client(server, jwt);
    const result = await client[":workspace"].stores.$get({
      param: {
        workspace,
      },
    });
    if (result.ok) {
      const json = await result.json();
      await skill.syncAll(workspace, agent, json);
      spinner.success(`Pulled ${json.length} stores`);
      return;
    }
    console.error(
      `Failed to pull`,
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
}

export const pullCommand = command({
  name: "pull",
  desc: "Pull bases",
  aliases: ["pl"],
  transform: async (opts) => {
    const currentConfig = await config.read();
    return { ...currentConfig, ...opts };
  },
  handler: pullCommandHanndler,
});
