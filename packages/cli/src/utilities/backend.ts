import { createClient } from "@web/client";
import { BASE_URL } from "./constants";

const headers = {
  "Content-Type": "application/json",
  "User-Agent": "@compeer/cli",
};

const client = createClient(BASE_URL, { headers });
export const backend = {
  client,
};
