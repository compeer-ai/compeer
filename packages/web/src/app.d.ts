declare global {
	namespace App {
		interface Locals {}

		interface Error {
			message: string;
			traceId?: string;
		}
	}
}

export {};
