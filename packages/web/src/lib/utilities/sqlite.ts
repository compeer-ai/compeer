import { drizzle } from 'drizzle-orm/libsql/sqlite3';
import * as schema from '$lib/utilities/schema';
import { createClient } from '@libsql/client/node';
import { SQLITE } from '$env/static/private';
const client = createClient({
	url: SQLITE
});

export const db = drizzle({ client, schema });
