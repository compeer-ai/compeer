import type { ServerInit } from '@sveltejs/kit';
import { db } from '$lib/utilities/sqlite';
import { loggers } from '$lib/utilities/loggers';
import { readdir } from 'node:fs/promises';
import pkg from '../package.json';
import { config } from '$lib/utilities/config';

export const init: ServerInit = async () => {
	if (pkg.version != config.version) {
		loggers.infra.error(
			`Configuration file version does not match that of docker image. Configuration version: ${config.version}. Docker image version: ${pkg.version}.`
		);
		process.exit(1);
	}
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
