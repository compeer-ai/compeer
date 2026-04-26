import type { Agent } from "./agent";

export interface Config {
  server: string;
  token: string;
  agent: Agent;
}
