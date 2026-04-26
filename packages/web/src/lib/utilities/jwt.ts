import { jwtVerify, SignJWT, type JWTPayload } from 'jose';
import { loggers } from './loggers';
import { secrets } from './secrets';

async function encode(payload: JWTPayload) {
	const JWT_SECRET = secrets.read('JWT_SECRET');
	const encoder = new TextEncoder();
	const jwt = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('2h')
		.sign(encoder.encode(JWT_SECRET));
	return jwt;
}

async function verify(token: string) {
	const JWT_SECRET = secrets.read('JWT_SECRET');
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
	verify
};
