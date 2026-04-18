import { error } from '@sveltejs/kit';
import { loggers } from './loggers';

function notFound(url: URL, message: string): Error {
	loggers.infra.child({ href: url.href }).error(message);
	throw error(404, {
		message
	});
}

function badRequest(url: URL, message: string): Error {
	loggers.infra.child({ href: url.href }).error(message);
	throw error(400, {
		message
	});
}

function unauthorized(url: URL, message: string) {
	loggers.security.child({ href: url.href }).error(message);
	throw error(401, {
		message
	});
}

function toManyRequests(url: URL, message: string) {
	loggers.security.child({ href: url.href }).error(message);
	throw error(429, {
		message
	});
}

function forbidden(url: URL, message: string) {
	loggers.security.child({ href: url.href }).error(message);
	throw error(403, {
		message
	});
}

export const errors = {
	notFound,
	unauthorized,
	badRequest,
	toManyRequests,
	forbidden
};
