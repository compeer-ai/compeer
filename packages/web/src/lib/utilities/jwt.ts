import { decodeJwt, jwtVerify, SignJWT, type JWTPayload } from 'jose';
import { loggers } from './loggers';
import { JWT_SECRET } from '$env/static/private';

async function encode(payload: JWTPayload) {
	const encoder = new TextEncoder();
	const jwt = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('2h')
		.sign(encoder.encode(JWT_SECRET));
	return jwt;
}

async function decode(token: string) {
	try {
		const { payload } = decodeJwt(token);
		return payload;
	} catch (err) {
		loggers.security.child({ err }).error('Failed to decode JWT');
		return null;
	}
}

async function verify(token: string): Promise<object | null> {
	const encoder = new TextEncoder();
	try {
		const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET));
		return payload;
	} catch (err) {
		loggers.security.child({ err }).error('Failed to verify JWT');
		return null;
	}
}

export const jwt = {
	encode,
	decode,
	verify
};
