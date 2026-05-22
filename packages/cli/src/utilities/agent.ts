import path from "node:path";
import { mkdir } from "node:fs/promises";
import { skill } from "./skill";
import os from "os"

const SKILL_NAME = "compeer";
const SKILL_DESCRIPTION = "Skill on how to use the compeer CLI, a tool to help you get better context on the task you have at hand";
const SKILL_BODY = [
  "# Commands",
  "",
  "## help",
  "Get help for any command.",
  "```bash",
  "compeer help",
  "compeer <command> --help",
  "```",
  "Use `compeer help` to list all commands, or `compeer <command> --help` for command-specific usage.",
  "",
  "",
  "## init",
  "Initialize a workspace with a compeer server.",
  "```bash",
  "compeer init [--server <url>]",
  "```",
  "Opens a browser for authentication and creates local config.",
  "",
  "## pull",
  "Pull stores from the workspace into local skill files.",
  "```bash",
  "compeer pull",
  "```",
  "Fetches all stores from the configured workspace and syncs them as agent skills.",
  "",
  "## capture",
  "Capture content (URL, data, or text) into a store.",
  "```bash",
  "compeer capture <workspace> <store> <content>",
  "```",
  "Auto-detects content type: URL, JSON data, or plain text.",
  "",
  "## search",
  "Search store captures with a query.",
  "```bash",
  "compeer search <workspace> <store> [--query <query>] [--pretty]",
  "```",
  "Returns matching captured content as JSON (or table with --pretty).",
  "",
  "## stores",
  "List all stores in a workspace.",
  "```bash",
  "compeer stores [--pretty]",
  "```",
  "Returns store list as JSON (or table with --pretty).",
  "",
  "## mcp",
  "Start an MCP (Model Context Protocol) server for a workspace/store.",
  "```bash",
  "compeer mcp <workspace> <store>",
  "```",
  "Runs an MCP server for AI agent tool integration.",
  "",
  "## web",
  "Open the web dashboard for a workspace.",
  "```bash",
  "compeer web",
  "```",
  "Opens the workspace dashboard in the default browser.",
  "",
  "## workspaces",
  "List all workspaces.",
  "```bash",
  "compeer workspaces [--pretty]",
  "```",
  "Returns workspace list as JSON (or table with --pretty).",
]
export const AGENTS = {
  "claude-code": async () => {
    const claudeCodeDir = path.join(os.homedir(), ".claude");
    await mkdir(claudeCodeDir, { recursive: true });
    const skillsDir = path.join(claudeCodeDir, "skills");
    await mkdir(skillsDir, { recursive: true });
    const compeerSkillDir = path.join(skillsDir, "compeer");
    await mkdir(compeerSkillDir, { recursive: true });
    await skill.create(compeerSkillDir, SKILL_NAME, SKILL_DESCRIPTION, SKILL_BODY);
  },
  codex: async () => {
    const codexDir = path.join(os.homedir(), ".codex");
    await mkdir(codexDir, { recursive: true });
    const skillsDir = path.join(codexDir, "skills");
    await mkdir(skillsDir, { recursive: true });
    const compeerSkillDir = path.join(skillsDir, "compeer");
    await mkdir(compeerSkillDir, { recursive: true });
    await skill.create(compeerSkillDir, SKILL_NAME, SKILL_DESCRIPTION, SKILL_BODY);
  },
  opencode: async () => {
    const opencodeDir = path.join(os.homedir(), ".opencode");
    await mkdir(opencodeDir, { recursive: true });
    const skillsDir = path.join(opencodeDir, "skills");
    await mkdir(skillsDir, { recursive: true });
    const compeerSkillDir = path.join(skillsDir, "compeer");
    await mkdir(compeerSkillDir, { recursive: true });
    await skill.create(compeerSkillDir, SKILL_NAME, SKILL_DESCRIPTION, SKILL_BODY);
  },
  "gemini-cli": async () => {
    const geminiCliDir = path.join(os.homedir(), ".gemini");
    await mkdir(geminiCliDir, { recursive: true });
    const skillsDir = path.join(geminiCliDir, "skills");
    await mkdir(skillsDir, { recursive: true });
    const compeerSkillDir = path.join(skillsDir, "compeer");
    await mkdir(compeerSkillDir, { recursive: true });
    await skill.create(compeerSkillDir, SKILL_NAME, SKILL_DESCRIPTION, SKILL_BODY);
  },
  "github-copilot": async () => {
    const githubCopilotDir = path.join(os.homedir(), ".copilot");
    await mkdir(githubCopilotDir, { recursive: true });
    const skillsDir = path.join(githubCopilotDir, "skills");
    await mkdir(skillsDir, { recursive: true });
    const compeerSkillDir = path.join(skillsDir, "compeer");
    await mkdir(compeerSkillDir, { recursive: true });
    await skill.create(compeerSkillDir, SKILL_NAME, SKILL_DESCRIPTION, SKILL_BODY);
  },
};

async function setup(agent: keyof typeof AGENTS) {
  await AGENTS[agent]();
}

export const agent = {
  setup,
};
