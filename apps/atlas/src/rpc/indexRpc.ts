import { Hono } from "hono";
import * as v from "valibot";
import type { Rpc } from "../index";
import { indexTable, selectIndexTable, type Index } from "../utilities/schema";
import { eq } from "drizzle-orm";
import { RPCError } from "@compeer-ai/rpc";

export function indexRpc(rpc: Rpc) {
  const postIndex = rpc.mutation(
    "POST",
    "/",
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

  const deleteIndex = rpc.mutation(
    "DELETE",
    "/",
    {
      inputSchema: v.object({
        name: v.string(),
      }),
      outputSchema: selectIndexTable,
    },
    async ({ name }, { database, artifacts }) => {
      const connection = database.connection();
      const [index] = await connection
        .delete(indexTable)
        .where(eq(indexTable.name, name))
        .returning();
      if (!index) {
        throw new RPCError(400, "Index not found");
      }
      await artifacts.delete(index.artifact);
      return index;
    },
  );

  return new Hono().route("/", postIndex.app).route("/", deleteIndex.app);
}
