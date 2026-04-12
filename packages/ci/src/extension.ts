import path from "node:path";
import { $ } from "bun";

const ROOT_DIR = path.resolve(import.meta.dir, "../../..");
const CLI_DIR = path.resolve(ROOT_DIR, "packages", "extension");

await $`bun run zip`.cwd(CLI_DIR);
await $`bun run zip:firefox`.cwd(CLI_DIR);
