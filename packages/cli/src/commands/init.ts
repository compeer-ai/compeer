import { command, string } from "@drizzle-team/brocli";
import { open } from "../utilities/open";
import { callbackServer } from "../utilities/callbackServer";
import { config } from "../utilities/config";
import * as v from "valibot";
import { pullCommandHanndler } from "./pull";
import yoctoSpinner from "yocto-spinner";

export const initCommand = command({
  name: "init",
  options: {
    server: string()
      .desc("Server of your Compeer instance")
      .default("http://localhost:3000"),
  },
  transform: async (opts) => {
    try {
      await fetch(new URL(`/api/v1/alive`, opts.server));
      return opts;
    } catch {
      console.error("Compeer server is not currently online");
      process.exit(1);
    }
  },
  handler: async (opts) => {
    const { server } = opts;
    const initilizationCallbackServer = callbackServer.start();
    const initilizationUrl = new URL(
      `/initilize?redirectUri=${initilizationCallbackServer.url.toString()}`,
      server,
    );
    await open(initilizationUrl);
    const spinner = yoctoSpinner({ text: "Initilizing Compeer" });
    const redirectUri = await initilizationCallbackServer.wait();
    const jwt = redirectUri.searchParams.get("jwt");
    const agent = redirectUri.searchParams.get("agent");
    const workspace = redirectUri.searchParams.get("workspace");
    const Agent = {
      claudeCode: "claude-code",
      code: "codex",
      opencode: "opencode",
      geminiCli: "gemini-cli",
      githubCopilot: "github-copilot",
    } as const;
    const schmea = v.object({
      workspace: v.string(),
      jwt: v.nullable(v.string()),
      agent: v.enum(Agent),
    });
    const result = await v.safeParseAsync(schmea, { jwt, agent, workspace });
    if (!result.success) {
      console.error(
        "Invalid parameters recieved by Compeer instance during initilization",
      );
      process.exit(1);
    }
    const createdConfig = await config.create({ ...result.output, server });
    spinner.success("Succesfully initialized Compeer");
    await pullCommandHanndler(createdConfig)
  },
});
