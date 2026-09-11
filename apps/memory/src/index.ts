import { Hono } from "hono";
import { createRpc } from "@compeer-ai/rpc";
import { config } from "./utilities/config";
import { memoryRpc } from "./rpc/memoryRpc";
import { storeRpc } from "./rpc/storeRpc";
import { database } from "./utilities/database";

function services(config: Config) {
  return {
    database: database(config),
  };
}

export type Config = typeof config;
export type Services = ReturnType<typeof services>;
export type Dependencies = Config & Services;
export type Rpc = ReturnType<typeof createRpc<Config, Services>>;

export function memory(config: Config) {
  const rpc = createRpc("memory", config, services, (e) =>
    console.error(e.message),
  );
  const app = new Hono<{ Variables: Dependencies }>();
  app.use(rpc.injection);
  app.route("/memory", memoryRpc(rpc));
  app.route("/store", storeRpc(rpc));
  return app;
}
