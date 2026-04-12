import type { ServerInit } from '@sveltejs/kit';
import { db } from '$lib/utilities/sqlite';
import { loggers } from '$lib/utilities/loggers';
import { readdir } from 'node:fs/promises';

export const init: ServerInit = async () => {
	const ddlDir = new URL('../ddl', import.meta.url);
	const ddlEntries = await readdir(ddlDir);
	const ddlFiles = ddlEntries
		.filter((entry) => entry.endsWith('.sql'))
		.sort((a, b) => a.localeCompare(b));
	for (const ddlFile of ddlFiles) {
		const ddlPath = new URL(`../ddl/${ddlFile}`, import.meta.url);
		const sql = await Bun.file(ddlPath).text();
		await db.$client.executeMultiple(sql);
	}

	loggers.infra.info(`Setup database (${ddlFiles.length} DDL files)`);
};
