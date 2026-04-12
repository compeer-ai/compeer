import path from "node:path";
import { $ } from "bun";

const ROOT_DIR = path.resolve(import.meta.dir, "../../..");
const CLI_DIR = path.resolve(ROOT_DIR, "packages", "cli");
const OTP = process.argv[2];

await $`bun run build`.cwd(CLI_DIR);
await $`npm publish --access public --otp ${OTP}`.cwd(CLI_DIR).quiet();
