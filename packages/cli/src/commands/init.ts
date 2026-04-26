import { command, string } from "@drizzle-team/brocli";
import { open } from "../utilities/open";

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
    await open(url);
  },
});
