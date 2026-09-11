import { mkdir, copyFile } from "node:fs/promises";
import path from "node:path";
import type { Config } from "..";

export function artifacts(config: Pick<Config, "artifactsPath">) {
  async function create(file: string) {
    const source = path.resolve(process.cwd(), file);
    const destination = path.join(
      config.artifactsPath,
      path.basename(source),
    );
    await mkdir(config.artifactsPath, { recursive: true });
    await copyFile(source, destination);
    return destination;
  }

  return {
    create,
  };
}