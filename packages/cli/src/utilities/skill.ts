import { type Store } from "$lib/repository/storeRepository";
import { mkdir } from "fs/promises";
import path from "path";

async function create(skillDir: string, name: string, description: string, body: string[]) {
  const header = [
    "---",
    `name: ${name}`,
    `description: ${description}`,
    "---",
    "",
  ].join("\n");
  const content = header + body.join('\n');
  const skillPath = path.join(skillDir, name)
  await mkdir(skillPath, {
    recursive: true,
  });
  await Bun.write(path.join(skillPath, "SKILL.md"), content);
}

async function sync(agent: string, workspace: string, store: Store) {
  const skillDir = path.join(process.cwd(), `.${agent}/skills`);
  await create(skillDir, store.name, store.description!!,  [
    `# ${store.name}`,
    "",
    "## Search Knowledge Base",
    "",
    "You can search this knowledge base using the `search` command. Example:",
    "",
    "```bash",
    `compeer search "${workspace}" "${store.name}" --query \"Frontend design specification\"`,
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
  ])  
}

async function syncAll(workspace: string, agent: string, stores: Store[]) {
  await Promise.all(stores.map((store) => sync(agent, workspace, store)));
}

export const skill = {
  sync,
  syncAll,
  create
};
