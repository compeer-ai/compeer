import { mkdir, copyFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Config } from "..";
import type { Index } from "./schema";

export function artifacts(config: Pick<Config, "artifactsPath">) {
  async function create(filePath: string, name: string) {
    const source = path.resolve(process.cwd(), filePath);
    const destination = path.join(config.artifactsPath, name);
    await mkdir(config.artifactsPath, { recursive: true });
    await copyFile(source, destination);
    return destination;
  }

  async function pull(source: string, name: string) {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(
        `Failed to pull artifact from ${source}: ${response.status} ${response.statusText}`,
      );
    }
    const contents = new Uint8Array(await response.arrayBuffer());
    const destination = path.join(config.artifactsPath, name);
    await mkdir(config.artifactsPath, { recursive: true });
    await writeFile(destination, contents);
    return destination;
  }

  async function _delete(name: string) {
    const source = path.join(config.artifactsPath, name);
    await unlink(source);
  }

  function update(index: Index) {
    let createFn: Promise<string>;
    if (index.source) {
      createFn = pull(index.source, index.name);
    } else if (index.path) {
      createFn = create(index.path, index.name);
    }
    return Promise.all([_delete(index.name), () => createFn]);
  }

  return {
    create,
    pull,
    update,
    delete: _delete,
  };
}
