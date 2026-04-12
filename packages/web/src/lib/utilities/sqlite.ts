import { drizzle } from 'drizzle-orm/libsql/sqlite3';
import * as schema from '$lib/utilities/schema';
import { createClient } from '@libsql/client/node';

const client = createClient({
	url: 'file:sqlite.db'
});
export const db = drizzle({ client, schema });
