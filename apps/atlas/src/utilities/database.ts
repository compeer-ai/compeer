import type { Config } from "..";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/node";
import path from "node:path";
import { schema } from "./schema";

export function database(config: Pick<Config, "databasePath">) {
  function connection() {
    const databasePath = path.join(config.databasePath, `database.sqlite`);
    const client = createClient({
      url: `file:${databasePath}`,
    });
    const connection = drizzle({ client, relations: schema });
    return connection;
  }
  return {
    connection,
  };
}
