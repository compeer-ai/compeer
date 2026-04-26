import { command, string } from "@drizzle-team/brocli";
import { open } from "../utilities/open";
import { callbackServer } from "../utilities/callbackServer";
import { config } from "../utilities/config";
import z from "zod";

export const initCommand = command({
  name: "init",
  options: {
    server: string()
      .desc("Server of your Compeer instance")
      .default("http://localhost:5173"),
  },
  handler: async (opts) => {
    const { server } = opts;
    const url = new URL("/initilize", server);
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
    const schmea = z.object({
      workspace: z.string(),
      jwt: z.string().optional(),
      agent: z.enum([
        "claude-code",
        "codex",
        "opencode",
        "gemini-cli",
        "github-copilot",
      ]),
    });
    const result = await schmea.safeParseAsync({ token, agent, workspace });
    if (!result.success) {
      console.error(
        "Invalidate parameters recieved by Compeer instance during initilization",
      );
      process.exit(1);
    }
    await config.create({ ...result.data, server });
  },
});
