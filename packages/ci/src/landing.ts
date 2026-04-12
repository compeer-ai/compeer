import path from "node:path";
import { $ } from "bun";

const ROOT_DIR = path.resolve(import.meta.dir, "../../..");
const LANDING_DIR = path.resolve(ROOT_DIR, "packages", "landing");
const BUILD_DIR = path.resolve(LANDING_DIR, "build");

await $`bun install`.cwd(ROOT_DIR);
await $`bun run build`.cwd(LANDING_DIR);
await $`bunx --bun wrangler pages deploy ${BUILD_DIR}`;
