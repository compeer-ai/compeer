import type { Config } from "..";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/node";
import path from "node:path";
import { schema } from "./schema";
import fs from "node:fs/promises";

export function database(config: Pick<Config, "databasePath">) {
  function exists(replica: string) {
    const databasePath = path.join(config.databasePath, `${replica}.sql`);
    return fs.exists(databasePath);
  }
  function connection(replica: string) {
    const databasePath = path.join(config.databasePath, `${replica}.sql`);
    const client = createClient({
      url: `file:${databasePath}`,
    });
    const connection = drizzle({ client, relations: schema });
    return connection;
  }
  return {
    connection,
    exists,
  };
}
