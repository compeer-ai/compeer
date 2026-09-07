import { rpc as createRpc } from "@compeer-ai/rpc";
import { Hono } from "hono";
import * as v from "valibot";
import type { Dependencies } from "../index";
import { memoryTable } from "../utilities/schema";

const rpc = createRpc<Dependencies>((e) => {
  console.error(e.message);
});

export const postCaptureText = rpc.mutation(
  "POST",
  "/capture/text",
  {
    inputSchema: v.object({
      store: v.string(),
      text: v.string(),
    }),
    outputSchema: v.object({
      store: v.string(),
      text: v.string(),
    }),
  },
  async ({ text, store }, { database }) => {
    const replica = database.connection(store);
    await replica.insert(memoryTable).values({ text }).execute();
    return { text, store };
  },
);

export const memoryRoute = new Hono().route("/", postCaptureText.app);
