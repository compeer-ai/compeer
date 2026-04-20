import { errors } from '$lib/utilities/errors';
import { jwt } from '$lib/utilities/jwt';
import { oidc } from '$lib/utilities/oidc';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies, url }) => {
	const codeVerifier = cookies.get('codeVerifier');
	if (!codeVerifier) throw errors.badRequest(url, 'Missing code verifier');
	const userInfo = await oidc.readUserInfo(codeVerifier);
	if (!userInfo) throw errors.unauthorized(url, 'Authentication failed');
	if (!userInfo.email || !userInfo.name) {
		throw errors.badRequest(url, 'Missing name and email from OIDC provider');
	}
	const encodedJwt = await jwt.encode({
		name: userInfo.name,
		email: userInfo.email
	});
	cookies.set('jwt', encodedJwt, {
		path: '/'
	});
	cookies.set('user', JSON.stringify({ email: userInfo.email, name: userInfo.name }), {
		path: '/'
	});
	return Response.redirect('/', 307);
};
