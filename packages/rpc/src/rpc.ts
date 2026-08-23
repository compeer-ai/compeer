import { Hono, type Context, type Env } from "hono";
import * as v from "valibot";
import type { GenericSchema, InferOutput } from "valibot";
import { cache } from "./utilities/cache.js";
import { describeRoute, resolver, validator } from "hono-openapi";
import { createFactory } from "hono/factory";
import type { StatusCode } from "hono/utils/http-status";
import type { Hook } from "@hono/standard-validator";

export const queryInt = () => v.pipe(v.string(), v.transform(Number));

export const queryDate = () =>
  v.pipe(
    v.string(),
    v.isoTimestamp(),
    v.transform((value) => new Date(value)),
  );

function cacheKey(path: string, params: unknown): string {
  return `${path}:${JSON.stringify(params)}`;
}
const factory = createFactory();

const namespaces: Record<string, string[]> = {};

type MutationMethod = "POST" | "PUT" | "DELETE" | "PATCH";

export class RPCError extends Error {
  public readonly statusCode: StatusCode;

  constructor(statusCode: StatusCode, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "RPCError";
    Object.setPrototypeOf(this, RPCError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RPCError);
    }
  }
}

export function rpc(onError: (e: Error) => void) {
  const validationHook: Hook<unknown, Env, string> = (result, c) => {
    if (!result.success) {
      onError(
        new Error("Validation failed", {
          cause: {
            issues: result.error,
            target: result.target,
          },
        }),
      );
      return c.json({ error: "Invalid input", issues: result.error }, 400);
    }
  };
  function impureQuery<
    const N extends string,
    I extends GenericSchema,
    K extends GenericSchema,
  >(
    path: N,
    args: {
      inputSchema: I;
      outputSchema: K;
    },
    fn: (args: InferOutput<I>) => InferOutput<K> | Promise<InferOutput<K>>,
  ) {
    const handler = factory.createHandlers(
      async (
        ctx: Context<
          {},
          string,
          { in: { query: InferOutput<I> }; out: { query: InferOutput<I> } }
        >,
      ) => {
        if (ctx.req.method !== "GET") throw new Error("Invalid RPC method");
        const params = ctx.req.valid("query") as InferOutput<I>;
        try {
          const result = await Promise.resolve(fn(params));
          return ctx.json({ result });
        } catch (e: unknown) {
          if (e instanceof RPCError) {
            onError(e);
            ctx.status(e.statusCode);
            return ctx.text(e.message);
          }
          onError(e as Error);
          ctx.status(500);
          return ctx.text("Internal Server Error");
        }
      },
    );

    const description = describeRoute({
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": { schema: resolver(args.outputSchema!) },
          },
        },
      },
    });

    const app = new Hono().get(
      path,
      description,
      validator("query", args.inputSchema, validationHook),
      ...handler,
    );

    return { app, path };
  }

  function query<
    const N extends string,
    I extends GenericSchema,
    K extends GenericSchema,
  >(
    namespace: N,
    args: {
      inputSchema: I;
      outputSchema: K;
    },
    fn: (
      args: InferOutput<I>,
      ctx: Context,
    ) => InferOutput<K> | Promise<InferOutput<K>>,
  ) {
    const handler = factory.createHandlers(
      async (
        ctx: Context<
          {},
          string,
          { in: { query: InferOutput<I> }; out: { query: InferOutput<I> } }
        >,
      ) => {
        const url = new URL(ctx.req.url);
        if (!url.pathname.endsWith(namespace)) {
          throw new Error("Invalid RPC name");
        }
        if (ctx.req.method !== "GET") throw new Error("Invalid RPC method");
        const params = ctx.req.valid("query") as InferOutput<I>;
        const key = cacheKey(namespace, params);
        const existingKeys = namespaces[namespace];
        if (!existingKeys) {
          namespaces[namespace] = [key];
        } else if (!(key in existingKeys)) {
          namespaces[namespace] = [...existingKeys, key];
        }
        try {
          const result = await cache.read(key, () => fn(params, ctx));
          return ctx.json(result);
        } catch (e: unknown) {
          if (e instanceof RPCError) {
            onError(e);
            ctx.status(e.statusCode);
            return ctx.text(e.message);
          }
          onError(e as Error);
          ctx.status(500);
          return ctx.text("Internal Server Error");
        }
      },
    );

    const description = describeRoute({
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": { schema: resolver(args.outputSchema!) },
          },
        },
      },
    });

    const app = new Hono().get(
      namespace,
      description,
      validator("query", args.inputSchema, validationHook),
      ...handler,
    );

    return {
      app,
      namespace,
      invalidate: (params: InferOutput<I>) =>
        cache.invalidate(cacheKey(namespace, params)),
      invalidateAll: () => cache.invalidate(...(namespaces[namespace] || [])),
    };
  }

  function mutation<
    const M extends MutationMethod,
    const P extends string,
    I extends GenericSchema,
    K extends GenericSchema,
  >(
    method: M,
    path: P,
    args: {
      inputSchema: I;
      outputSchema: K;
    },
    fn: (
      args: InferOutput<I>,
      ctx: Context,
    ) => InferOutput<K> | Promise<InferOutput<K>>,
    invalidate?: (args: InferOutput<I>) => string[],
  ) {
    const handler = factory.createHandlers(
      async (
        ctx: Context<
          { Variables: { invalidations: string[] } },
          string,
          { in: { json: InferOutput<I> }; out: { json: InferOutput<K> } }
        >,
      ) => {
        const url = new URL(ctx.req.url);
        if (!url.pathname.endsWith(path)) {
          throw new Error("Invalid RPC name");
        }
        if (!["POST", "DELETE", "PUT", "PATCH"].includes(ctx.req.method))
          throw new Error("Invalid RPC method");
        const json = ctx.req.valid("json") as InferOutput<I>;
        try {
          const result = await Promise.resolve(fn(json, ctx));
          invalidate?.(json);
          return ctx.json(result);
        } catch (e: unknown) {
          if (e instanceof RPCError) {
            onError(e);
            ctx.status(e.statusCode);
            return ctx.text(e.message);
          }
          onError(e as Error);
          ctx.status(500);
          return ctx.text("Internal Server Error");
        }
      },
    );

    const description = describeRoute({
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": { schema: resolver(args.outputSchema!) },
          },
        },
      },
    });

    const app = new Hono().on(
      method,
      path,
      description,
      validator("json", args.inputSchema, validationHook),
      ...handler,
    );

    return {
      app,
      method,
      path,
      handler,
      inputSchema: args.inputSchema,
      outputSchema: args.outputSchema,
      description: args.outputSchema && description,
      fn,
    };
  }

  return {
    mutation,
    query,
    impureQuery,
  };
}
