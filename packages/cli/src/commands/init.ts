import { command, string } from "@drizzle-team/brocli";
import { open } from "../utilities/open";
import { callbackServer } from "../utilities/callbackServer";
import { config } from "../utilities/config";
import * as v from "valibot";

export const initCommand = command({
  name: "init",
  options: {
    server: string()
      .desc("Server of your Compeer instance")
      .default("http://localhost:5173"),
  },
  handler: async (opts) => {
    const { server } = opts;
    const initilizationCallbackServer = callbackServer.start();
    const initilizationUrl = new URL(
      `/initilize?redirectUri=${initilizationCallbackServer.url.toString()}`,
      server,
    );
    await open(initilizationUrl);
    const redirectUri = await initilizationCallbackServer.wait();
    const token = redirectUri.searchParams.get("token");
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
    const result = await v.safeParseAsync(schmea, { token, agent, workspace });
    if (!result.success) {
      console.error(
        "Invalidate parameters recieved by Compeer instance during initilization",
      );
      process.exit(1);
    }
    await config.create({ ...result.output, server });
  },
});
