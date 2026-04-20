import { decodeJwt, jwtVerify, SignJWT, type JWTPayload } from 'jose';

async function encode(payload: JWTPayload, secret: string) {
	const encoder = new TextEncoder();
	const jwt = await new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('2h')
		.sign(encoder.encode(secret));
	return jwt;
}

async function decode(token: string) {
	try {
		const { payload } = decodeJwt(token);
		return payload;
	} catch (err) {
		console.error('Failed to decode JWT:', err);
		return null;
	}
}

async function verify(token: string, secret: string): Promise<object | null> {
	const encoder = new TextEncoder();
	try {
		const { payload } = await jwtVerify(token, encoder.encode(secret));
		return payload;
	} catch (err) {
		console.error('JWT verification failed:', err);
		return null;
	}
}

export const jwt = {
	encode,
	decode,
	verify
};
