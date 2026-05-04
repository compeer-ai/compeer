import { createClient } from "@web/client";

let headers: Record<string, string> = {
  "Content-Type": "application/json",
  "User-Agent": "@compeer/cli",
};

export const backend = {
  client: (server: string, jwt: string | null) =>
    createClient(
      server,
      jwt
        ? { headers: { ...headers, Authorization: `Bearer ${jwt}` } }
        : { headers },
    ).api.v1,
};
