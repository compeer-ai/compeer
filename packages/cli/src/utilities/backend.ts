import { createClient } from "@web/client";
import { BASE_URL } from "./constants";
import { config } from "./config";

const headers = {
  "Content-Type": "application/json",
  "User-Agent": "@barque/cli",
};

const client = createClient(BASE_URL, { headers });
export const backend = {
  client,
};
