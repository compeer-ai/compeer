import { createClient } from "@web/client";
import { BASE_URL } from "./constants";

let headers: Record<string, string> = {
  "Content-Type": "application/json",
  "User-Agent": "@compeer/cli",
};

export const backend = {
  client: (jwt: string | null) =>
    createClient(
      BASE_URL,
      jwt
        ? { headers: { ...headers, Authorization: `Bearer ${jwt}` } }
        : { headers },
    ).api.v1,
};
