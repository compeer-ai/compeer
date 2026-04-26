import type { Config } from "../models/config";
import { CONFIG_FILE } from "./constants";

let cacheConfig: Config | null = null;

async function create(config: Config) {
  await Bun.write(CONFIG_FILE, JSON.stringify(config, null, 2));
}

async function safeRead() {
  if (cacheConfig) {
    return cacheConfig;
  }
  const file = Bun.file(CONFIG_FILE);
  if (await file.exists()) {
    const json = await file.json();
    if (json) {
      cacheConfig = json;
      return json as Config;
    }
  }
}

async function read() {
  if (cacheConfig) {
    return cacheConfig;
  }
  const file = Bun.file(CONFIG_FILE);
  if (!(await file.exists())) {
    console.error("Compeer is not configured for this directory");
    process.exit(1);
  }
  const json = await file.json();
  return json as Config;
}

export const config = {
  read,
  safeRead,
  create,
};
