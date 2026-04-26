function start() {
  let resolveFn: (url: URL) => void;

  const resultPromise = new Promise<URL>((resolve) => {
    resolveFn = resolve;
  });

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  const server = Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);

      if (req.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: corsHeaders,
        });
      }

      if (url.pathname === "/callback") {
        resolveFn(url);

        return new Response(null, {
          status: 200,
          headers: corsHeaders,
        });
      }

      return new Response("Not found", {
        status: 404,
        headers: corsHeaders,
      });
    },
  });

  const callbackUrl = new URL(`/callback`, `http://localhost:${server.port}`);

  return {
    url: callbackUrl,
    wait: async () => {
      const result = await resultPromise;
      server.stop();
      return result;
    },
  };
}

export const callbackServer = {
  start,
};
