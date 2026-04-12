import { z } from "zod";
import { CONFIG_FILE } from "./constants";

const configSchema = z.object({
  server: z.string().default("http://localhost:5173"),
  workspace: z.string(),
  agent: z.enum(["opencode", "gemini-cli", "github-copilot", "claude-code"]),
});

type Config = z.infer<typeof configSchema>;

let cacheConfig: Config | null = null;

export async function safeRead() {
  if (cacheConfig) {
    return cacheConfig;
  }
  const file = Bun.file(CONFIG_FILE);
  if (await file.exists()) {
    const json = await file.json();
    const { data } = await configSchema.safeParseAsync(json);
    if (data) {
      cacheConfig = data;
      return data;
    }
  }
}

export async function read() {
  if (cacheConfig) {
    return cacheConfig;
  }
  const file = Bun.file(CONFIG_FILE);
  if (!(await file.exists())) {
    console.error("Barque is not configured for this directory");
    process.exit(1);
  }
  const json = await file.json();
  const data = await configSchema.parseAsync(json);
  return data;
}

export const config = {
  read,
  safeRead,
};
