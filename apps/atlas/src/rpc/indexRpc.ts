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
      await artifacts.create(path, name);
      const [index] = await connection
        .insert(indexTable)
        .values({ name, path })
        .returning();
      return index as Index;
    },
  );

  const postExternalIndex = rpc.mutation(
    "POST",
    "/",
    {
      inputSchema: v.object({
        name: v.string(),
        source: v.pipe(v.string(), v.url()),
      }),
      outputSchema: selectIndexTable,
    },
    async ({ name, source }, { database, artifacts }) => {
      const connection = database.connection();
      await artifacts.pull(source, name);
      const [index] = await connection
        .insert(indexTable)
        .values({ name, source })
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
      await artifacts.delete(index.name);
      return index;
    },
  );

  const updateIndex = rpc.mutation(
    "PUT",
    "/",
    {
      inputSchema: v.object({
        name: v.string(),
        path: v.string(),
      }),
      outputSchema: selectIndexTable,
    },
    async ({ name, path }, { database, artifacts }) => {
      const connection = database.connection();
      const [index] = await connection
        .update(indexTable)
        .set({ path })
        .where(eq(indexTable.name, name))
        .returning();
      if (!index) {
        throw new RPCError(400, "Index not found");
      }
      await artifacts.update(index);
      return index;
    },
  );

  const searchIndex = rpc.impureQuery(
    "/",
    {
      inputSchema: v.object({
        query: v.string(),
      }),
      outputSchema: v.array(v.string()),
    },
    async () => {
      return [];
    },
  );

  return new Hono()
    .route("/", postIndex.app)
    .route("/", deleteIndex.app)
    .route("/", updateIndex.app)
    .route("/", searchIndex.app)
    .route("/", postExternalIndex.app);
}
