import { z, ZodType } from "zod";

export function fetcher(baseUrl: string, config?: Record<string, unknown>) {
  function request<S extends ZodType, J>(
    method: "POST" | "GET" | "PUT",
    endpoint: (validatedBody: z.infer<S>) => string,
    schema: S,
  ) {
    const fetcher = async (body: J) => {
      const validatedBody = await schema.parseAsync(body);
      const url = new URL(endpoint(validatedBody), baseUrl);
      return fetch(url, {
        headers: { method, ...config },
        body: JSON.stringify(validatedBody),
      });
    };
    return {
      fetcher,
      schema,
    };
  }

  return {
    request,
  };
}
