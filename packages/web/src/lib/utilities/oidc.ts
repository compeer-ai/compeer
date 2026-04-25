import * as client from 'openid-client';
import { decodeJwt } from 'jose';
import { secrets } from './secrets';
import { config } from './config';

function enabled() {
	const [OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_SERVER] = [
		secrets.safeRead('OIDC_CLIENT_ID'),
		secrets.safeRead('OIDC_CLIENT_SECRET'),
		secrets.safeRead('OIDC_SERVER')
	];
	return !!OIDC_CLIENT_ID && !!OIDC_CLIENT_SECRET && !!OIDC_SERVER;
}

async function login() {
	const [OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_SERVER] = [
		secrets.read('OIDC_CLIENT_ID'),
		secrets.read('OIDC_CLIENT_SECRET'),
		secrets.read('OIDC_SERVER')
	];
	const SERVER = new URL(OIDC_SERVER);
	const CONFIG = await client.discovery(SERVER, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET);
	const REDIRECT_URI = new URL('/auth', config.url);
	const codeVerifier = client.randomPKCECodeVerifier();
	const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
	const authorizationUrl = client.buildAuthorizationUrl(CONFIG, {
		redirect_uri: REDIRECT_URI.toString(),
		scope: 'openid profile email',
		code_challenge: codeChallenge,
		code_challenge_method: 'S256'
	});
	return {
		authorizationUrl,
		codeVerifier
	};
}

async function readUserInfo(codeVerifier: string) {
	const [OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_SERVER] = [
		secrets.read('OIDC_CLIENT_ID'),
		secrets.read('OIDC_CLIENT_SECRET'),
		secrets.read('OIDC_SERVER')
	];
	const SERVER = new URL(OIDC_SERVER);
	const CONFIG = await client.discovery(SERVER, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET);
	const REDIRECT_URI = new URL('/auth', config.url);
	const { access_token: accessToken, id_token: idToken } = await client.authorizationCodeGrant(
		CONFIG,
		REDIRECT_URI,
		{
			pkceCodeVerifier: codeVerifier
		}
	);
	if (!idToken) {
		return null;
	}
	const sub = decodeJwt(idToken).sub!;
	const userInfo = await client.fetchUserInfo(CONFIG, accessToken, sub);
	return userInfo;
}

export const oidc = { login, readUserInfo, enabled };
