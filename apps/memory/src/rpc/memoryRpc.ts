import { Hono } from "hono";
import * as v from "valibot";
import { eq, like } from "drizzle-orm";
import type { Rpc } from "../index";
import { Memory, memoryTable, selectMemorySchema } from "../utilities/schema";
import { RPCError } from "@compeer-ai/rpc";

export function memoryRpc(rpc: Rpc) {
  const postCapture = rpc.mutation(
    "POST",
    "/capture",
    {
      inputSchema: v.object({
        text: v.string(),
        data: v.union([
          v.string(),
          v.number(),
          v.boolean(),
          v.array(v.unknown()),
          v.record(v.string(), v.unknown()),
        ]),
        store: v.string(),
      }),
      outputSchema: selectMemorySchema,
    },
    async ({ store, text, data }, { database }) => {
      const exists = await database.exists(store);
      if (!exists) throw new RPCError(404, `Store ${store} not found`);
      const replica = database.connection(store);
      const [result] = await replica
        .insert(memoryTable)
        .values({ data, text })
        .returning();
      return result as Memory;
    },
  );

  const getCaptureSearch = rpc.impureQuery(
    "/capture/search",
    {
      inputSchema: v.object({
        text: v.string(),
        store: v.string(),
      }),
      outputSchema: v.array(selectMemorySchema),
    },
    async ({ text, store }, { database }) => {
      const exists = await database.exists(store);
      if (!exists) throw new RPCError(404, `Store ${store} not found`);
      const replica = database.connection(store);
      const captures = await replica
        .select()
        .from(memoryTable)
        .where(like(memoryTable.text, text));
      return captures as Memory[];
    },
  );

  rpc.mutation(
    "DELETE",
    "/capture",
    {
      inputSchema: v.object({
        store: v.string(),
        id: v.pipe(v.string(), v.uuid()),
      }),
      outputSchema: v.object({
        id: v.pipe(v.string(), v.uuid()),
      }),
    },
    async ({ id, store }, { database }) => {
      const exists = await database.exists(store);
      if (!exists) throw new RPCError(404, `Store ${store} not found`);

      const replica = database.connection(store);
      await replica.delete(memoryTable).where(eq(memoryTable.id, id));
      return { id };
    },
  );

  return new Hono()
    .route("/", postCapture.app)
    .route("/", getCaptureSearch.app);
}
