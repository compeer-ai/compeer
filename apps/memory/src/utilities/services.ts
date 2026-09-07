import type { Config } from "..";
import { database } from "./database";

export function createServices(config: Config) {
  return {
    database: database(config),
  };
}

export type Services = ReturnType<typeof createServices>;