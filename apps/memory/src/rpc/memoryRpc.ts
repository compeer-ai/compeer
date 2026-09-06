import { rpc as createRpc } from "@compeer-ai/rpc";
import { Hono } from "hono";
import * as v from "valibot";

const rpc = createRpc((e) => {
  console.error(e.message);
});

const postCaptureText = rpc.mutation(
  "POST",
  "/capture/text",
  {
    inputSchema: v.object({
      text: v.string(),
    }),
    outputSchema: v.object({
      text: v.string(),
    }),
  },
  (args) => {
    console.log(args);
    return args;
  },
);

export const memoryRpc = new Hono().route("/", postCaptureText.app);
