import { Hono } from "hono";
import * as v from "valibot";
import type { Rpc } from "../index";

export function storeRpc(rpc: Rpc) {
  const postStore = rpc.mutation(
    "POST",
    "/",
    {
      inputSchema: v.object({
        name: v.string(),
      }),
      outputSchema: v.object({
        name: v.string(),
      }),
    },
    ({ name }, { database }) => {
      database.connection(name);
      return { name };
    },
  );

  return new Hono().route("/", postStore.app);
}
