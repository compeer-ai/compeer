import { Hono } from "hono";
import { memoryRoute } from "./rpc/memoryRpc";
import { config as _config } from "./utilities/config";
import { createServices, type Services } from "./utilities/services";
import { storeRoute } from "./rpc/storeRpc";

export type Config = typeof _config;
export type Dependencies = Config & Services;

export function memory(config: Config) {
  const app = new Hono<{ Variables: Dependencies }>();
  app.use((c, next) => {
    const deps = { ...config, ...createServices(config) } as Dependencies;
    Object.entries(deps).forEach(([key, value]) => {
      c.set(key as keyof Dependencies, value as Dependencies[keyof Dependencies]);
    });
    return next();
  });
  app.route("/memory", memoryRoute);
  app.route("/store", storeRoute);
  return app;
}
