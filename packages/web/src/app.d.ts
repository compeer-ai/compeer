declare global {
	namespace App {
		interface Locals {
			userId?: string;
		}

		interface Error {
			message: string;
			traceId?: string;
		}
	}

	interface Window {
		umami: {
			track: (eventName: string, eventData?: Record<string, unknown>) => void;
		};
	}
}

export {};
