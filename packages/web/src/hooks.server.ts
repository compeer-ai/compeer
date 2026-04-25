import { redirect, type Cookies, type Handle, type ServerInit } from '@sveltejs/kit';
import { db } from '$lib/utilities/sqlite';
import { loggers } from '$lib/utilities/loggers';
import { readdir } from 'node:fs/promises';
import pkg from '../package.json';
import { config } from '$lib/utilities/config';
import { OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_SERVER } from '$env/static/private';
import { oidc } from '$lib/utilities/oidc';
import { jwt } from '$lib/utilities/jwt';

function protectedRoute(url: URL, ...pathnames: string[]) {
	return pathnames.some((pathname) => pathname.startsWith(url.pathname));
}

async function login(cookies: Cookies) {
	const { authorizationUrl, codeVerifier } = await oidc.login();
	cookies.set('codeVerifier', codeVerifier, {
		path: '/'
	});
	return Response.redirect(authorizationUrl, 307);
}

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = event.cookies;
	const oidcEnabled = OIDC_SERVER && OIDC_CLIENT_SECRET && OIDC_CLIENT_ID;
	if (protectedRoute(event.url, '/auth', '/api/v1') && oidcEnabled) {
		const currentJwt = cookies.get('jwt');
		if (!currentJwt) {
			return login(cookies);
		}
		const verifiedJwt = await jwt.verify(currentJwt);
		if (!verifiedJwt) {
			cookies.delete('user', {
				path: '/'
			});
			cookies.delete('jwt', {
				path: '/'
			});
			return login(cookies);
		}
	}

	return resolve(event);
};

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
