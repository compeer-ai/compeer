import type { Config } from "../models/config";
import { CONFIG_FILE } from "./constants";
import { mkdir } from "fs/promises";
import { join } from "path";
import pkg from "../../package.json";

await mkdir(join(process.cwd(), ".compeer"), { recursive: true });

let cacheConfig: Config | null = null;

async function create(config: Omit<Config, "version">) {
  await Bun.write(
    CONFIG_FILE,
    JSON.stringify({ ...config, version: pkg.version }, null, 2),
  );
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
