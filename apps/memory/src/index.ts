import { Hono } from "hono";
import { memoryRpc } from "./rpc/memoryRpc";

const app = new Hono();

app.route("/memory", memoryRpc);

export default app;
