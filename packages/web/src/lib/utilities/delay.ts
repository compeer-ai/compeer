import { random } from './random';

export function delay(ms: number = random.choice(150, 200, 180, 250, 120)) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
