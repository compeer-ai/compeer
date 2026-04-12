import { createClient } from "@web/client";

export const backend = createClient(import.meta.env.WXT_BARQUE_URL, {
  headers: {
    "User-Agent": "@barque/extension",
  },
});
