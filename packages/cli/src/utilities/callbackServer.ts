function create() {
  let resolveFn: (url: URL) => void;

  const resultPromise = new Promise<URL>((resolve) => {
    resolveFn = resolve;
  });

  const server = Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === "/callback") {
        resolveFn(url);

        return new Response(null, { status: 200 });
      }

      return new Response("Not found", { status: 404 });
    },
  });

  const callbackUrl = `http://localhost:${server.port}/callback`;

  return {
    url: callbackUrl,
    wait: async () => {
      const result = await resultPromise;
      server.stop();
      return result;
    },
  };
}

export const server = {
  create,
};
