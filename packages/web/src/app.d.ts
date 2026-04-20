declare global {
	namespace App {
		interface Locals {
			user?: {
				name: string;
			};
		}

		interface Error {
			message: string;
			traceId?: string;
		}
	}
}

export {};
