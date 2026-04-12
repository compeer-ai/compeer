export interface Toast {
	message: string;
	level: 'success' | 'failure' | 'loading';
	id: number;
}
