import { Hono } from "hono";
import { createRpc } from "@compeer-ai/rpc";
import { config } from "./utilities/config";
import { indexRpc } from "./rpc/indexRpc";
import { database } from "./utilities/database";
import { artifacts } from "./utilities/artifacts";

function services(config: Config) {
  return {
    database: database(config),
    artifacts: artifacts(config),
  };
}

export type Config = typeof config;
export type Services = ReturnType<typeof services>;
export type Dependencies = Config & Services;
export type Rpc = ReturnType<typeof createRpc<Config, Services>>;

export function memory(config: Config) {
  const rpc = createRpc("atlas", config, services, (e) =>
    console.error(e.message),
  );
  const app = new Hono<{ Variables: Dependencies }>();
  app.use(rpc.injection);
  app.route("/index", indexRpc(rpc));
  return app;
}
