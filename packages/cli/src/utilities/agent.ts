import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";

const SKILL = await Bun.file(
  new URL("../assets/SKILL.md", import.meta.url),
).text();

export const AGENTS = {
  "claude-code": async () => {
    const claudeCodeDir = path.join(process.cwd(), ".claude");
    await mkdir(claudeCodeDir, { recursive: true });
    const skillsDir = path.join(claudeCodeDir, "skills");
    await mkdir(skillsDir, { recursive: true });
    const barqueSkillDir = path.join(skillsDir, "barque");
    await mkdir(barqueSkillDir, { recursive: true });
    await writeFile(path.join(barqueSkillDir, "SKILL.md"), SKILL);
  },
  codex: async () => {
    const codexDir = path.join(process.cwd(), ".codex");
    await mkdir(codexDir, { recursive: true });
    const skillsDir = path.join(codexDir, "skills");
    await mkdir(skillsDir, { recursive: true });
    const barqueSkillDir = path.join(skillsDir, "barque");
    await mkdir(barqueSkillDir, { recursive: true });
    await writeFile(path.join(barqueSkillDir, "SKILL.md"), SKILL);
  },
  opencode: async () => {
    const opencodeDir = path.join(process.cwd(), ".opencode");
    await mkdir(opencodeDir, { recursive: true });
    const skillsDir = path.join(opencodeDir, "skills");
    await mkdir(skillsDir, { recursive: true });
    const barqueSkillDir = path.join(skillsDir, "barque");
    await mkdir(barqueSkillDir, { recursive: true });
    await writeFile(path.join(barqueSkillDir, "SKILL.md"), SKILL);
  },
  "gemini-cli": async () => {
    const geminiCliDir = path.join(process.cwd(), ".gemini");
    await mkdir(geminiCliDir, { recursive: true });
    const skillsDir = path.join(geminiCliDir, "skills");
    await mkdir(skillsDir, { recursive: true });
    const barqueSkillDir = path.join(skillsDir, "barque");
    await mkdir(barqueSkillDir, { recursive: true });
    await writeFile(path.join(barqueSkillDir, "SKILL.md"), SKILL);
  },
  "github-copilot": async () => {
    const githubCopilotDir = path.join(process.cwd(), ".github");
    await mkdir(githubCopilotDir, { recursive: true });
    const skillsDir = path.join(githubCopilotDir, "skills");
    await mkdir(skillsDir, { recursive: true });
    const barqueSkillDir = path.join(skillsDir, "barque");
    await mkdir(barqueSkillDir, { recursive: true });
    await writeFile(path.join(barqueSkillDir, "SKILL.md"), SKILL);
  },
};

async function setup(agent: keyof typeof AGENTS) {
  await AGENTS[agent]();
}

export const agent = {
  setup,
};
