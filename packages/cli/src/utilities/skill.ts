import { type Store } from "$lib/repository/storeRepository";
import { mkdir } from "fs/promises";
import path from "path";

async function sync(agent: string, workspace: string, store: Store) {
  const skillName = store.name.toLocaleLowerCase().split(" ").join("-");
  const skillPath = path.join(process.cwd(), `.${agent}/skills/${skillName}`);
  await mkdir(skillPath, {
    recursive: true,
  });
  const header = [
    "---",
    `name: ${skillName}`,
    `description: ${store.description}`,
    "---",
    "",
  ].join("\n");
  const body = [
    `# ${store.name}`,
    "",
    "## Search Knowledge Base",
    "",
    "You can search this knowledge base using the `search` command. Example:",
    "",
    "```bash",
    `compeer search "${workspace}" "${store.name}" \"Frontend design specification\"`,
    "```",
    "",
    "## Add to Knowledge Base",
    "",
    "If you need to remember something to be searched later, use the `capture` command.",
    "",
    "Example of capturing text:",
    "",
    "```bash",
    `compeer capture "${workspace}" "${store.name}" \"This project is for UI development\"`,
    "```",
    "",
    "Example of capturing a website:",
    "",
    "```bash",
    `compeer capture "${workspace}" "${store.name}" \"https://compeer.ai\"`,
    "```",
    "",
    "Example of capturing a data payload:",
    "",
    "```bash",
    `compeer capture  "${workspace}" "${store.name}" \"{'hello': 'world'}\"`,
    "```",
  ].join("\n");
  await Bun.write(path.join(skillPath, "SKILL.md"), header + body);
}

async function syncAll(workspace: string, agent: string, stores: Store[]) {
  await Promise.all(stores.map((store) => sync(agent, workspace, store)));
}

export const skill = {
  sync,
  syncAll,
};
