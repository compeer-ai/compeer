import type { Agent } from "./agent";

export interface Config {
  version: string;
  server: string;
  jwt?: string;
  workspace: string;
  agent: Agent;
}
