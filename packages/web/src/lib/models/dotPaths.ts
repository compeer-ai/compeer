export type DotPaths<T, Prefix extends string = ''> = {
	[K in keyof T]: K extends string
		? T[K] extends Record<string, any>
			? `${Prefix}${K}` | DotPaths<T[K], `${Prefix}${K}.`>
			: `${Prefix}${K}`
		: never;
}[keyof T];
