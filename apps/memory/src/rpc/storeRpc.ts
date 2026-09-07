import { rpc as createRpc } from "@compeer-ai/rpc";
import { Hono } from "hono";
import * as v from "valibot";
import type { Dependencies } from "../index";

const rpc = createRpc<Dependencies>((e) => {
  console.error(e.message);
});

export const postStore = rpc.mutation(
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

export const storeRoute = new Hono().route("/", postStore.app);
