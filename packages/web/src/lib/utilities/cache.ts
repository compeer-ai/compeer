class LRUCache {
	private cache = new Map<string, any>();
	private maxSize: number;

	constructor(maxSize: number = 1000) {
		this.maxSize = maxSize;
	}

	get<T>(key: string): T | undefined {
		const value = this.cache.get(key);
		if (value !== undefined) {
			this.cache.delete(key);
			this.cache.set(key, value);
		}
		return value;
	}

	set<T>(key: string, value: T) {
		if (this.cache.has(key)) {
			this.cache.delete(key);
		} else if (this.cache.size >= this.maxSize) {
			const firstKey = this.cache.keys().next().value;
			if (firstKey) {
				this.cache.delete(firstKey);
			}
		}
		this.cache.set(key, value);
	}

	delete(key: string) {
		this.cache.delete(key);
	}
}

const lru = new LRUCache();
const namespaces: Record<string, string[]> = {};

async function read<T>(key: string, onVacant: () => Promise<T> | T) {
	const storedValue = lru.get<T>(key);
	if (storedValue !== undefined) {
		return storedValue;
	}
	const value = await Promise.resolve(onVacant());
	lru.set(key, value);
	return value;
}

function invalidate(...keys: string[]) {
	keys.forEach((key) => lru.delete(key));
}

function link(name: string, key: string) {
	if (name in namespaces) {
		namespaces[name].push(key)
	} else {
		namespaces[name] = [key]
	}
}

function invalidateNamespace(namespace: string) {
	const keys = namespaces[namespace] || [];
	invalidate(...keys)
}

export const cache = {
	read,
	invalidate,
	link,
	invalidateNamespace
};
