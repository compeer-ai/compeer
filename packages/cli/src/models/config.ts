import type { Agent } from "./agent";

export interface Config {
  server: string;
  token: string;
  workspace: string;
  agent: Agent;
}
