import { mkdir, copyFile, unlink } from "node:fs/promises";
import path from "node:path";
import type { Config } from "..";

export function artifacts(config: Pick<Config, "artifactsPath">) {
  async function create(file: string) {
    const source = path.resolve(process.cwd(), file);
    const destination = path.join(config.artifactsPath, path.basename(source));
    await mkdir(config.artifactsPath, { recursive: true });
    await copyFile(source, destination);
    return destination;
  }

  async function _delete(artifact: string) {
    const source = path.join(config.artifactsPath, artifact);
    await unlink(source);
  }

  function update(currentArtifact: string, newArtifact: string) {
    return Promise.all([_delete(currentArtifact), create(newArtifact)]);
  }

  return {
    create,
    update,
    delete: _delete,
  };
}
