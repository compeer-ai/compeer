import { type Project } from "$lib/repository/projectRepository";
import { mkdir } from "fs/promises";
import path from "path";

async function sync(agent: string, project: Project) {
  const skillName = project.name.toLocaleLowerCase().split(" ").join("-");
  const skillPath = path.join(process.cwd(), `.${agent}/skills/${skillName}`);
  await mkdir(skillPath, {
    recursive: true,
  });
  const header = [
    "---",
    `name: ${skillName}`,
    `description: ${project.description}`,
    "---",
    "",
  ].join("\n");
  const body = [
    `# ${project.name}`,
    "",
    "## Search Knowledge Base",
    "",
    "You can search this knowledge base using the `search` command. Example:",
    "",
    "```bash",
    `barque ${skillName} search \"Frontend design specification\"`,
    "```",
    "",
    "## Add to Knowledge Base",
    "",
    "If you need to remember something to be searched later, use the `capture` command.",
    "",
    "Example of capturing text:",
    "",
    "```bash",
    `barque ${skillName} capture \"\"`,
    "```",
    "",
    "Example of capturing a website:",
    "",
    "```bash",
    `barque ${skillName} capture \"https://barque.ai\"`,
    "```",
    "",
    "Example of capturing a data payload:",
    "",
    "```bash",
    `barque ${skillName} capture \"{'hello': 'world'}\"`,
    "```",
  ].join("\n");
  await Bun.write(path.join(skillPath, "SKILL.md"), header + body);
}

async function syncAll(agent: string, projects: Project[]) {
  await Promise.all(projects.map((project) => sync(agent, project)));
}

export const skill = {
  sync,
  syncAll,
};
