import { Hono } from "hono";
import * as v from "valibot";
import type { Rpc } from "../index";
import { indexTable, selectIndexTable, type Index } from "../utilities/schema";

export function indexRpc(rpc: Rpc) {
  const postIndex = rpc.mutation(
    "POST",
    "/index",
    {
      inputSchema: v.object({
        name: v.string(),
        path: v.string(),
      }),
      outputSchema: selectIndexTable,
    },
    async ({ path, name }, { database, artifacts }) => {
      const connection = database.connection();
      const artifact = await artifacts.create(path);
      const [index] = await connection
        .insert(indexTable)
        .values({ name, artifact })
        .returning();
      return index as Index;
    },
  );

  return new Hono().route("/", postIndex.app);
}
