import { db } from '$lib/utilities/sqlite';
import { and, eq, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import type { AnySQLiteTable, SQLiteTable, SQLiteColumn } from 'drizzle-orm/sqlite-core';

export class BaseRepoistory<T extends AnySQLiteTable, K> {
	private table: T;
	private idColumn: SQLiteColumn;

	constructor(table: T, idColumn: SQLiteColumn) {
		this.table = table;
		this.idColumn = idColumn;
	}

	async create(row: InferInsertModel<T>) {
		const result = (await db.insert(this.table).values(row).returning()) as InferSelectModel<T>[];
		function first() {
			return result[0];
		}

		function all() {
			return result;
		}

		return {
			first,
			all
		};
	}

	async createMany(rows: InferInsertModel<T>[]) {
		const result = (await db.insert(this.table).values(rows).returning()) as InferSelectModel<T>[];

		function first() {
			return result[0];
		}

		function all() {
			return result;
		}

		return {
			first,
			all
		};
	}

	async deleteById(id: K) {
		const result = (await db
			.delete(this.table)
			.where(eq(this.idColumn, id))
			.returning()) as InferSelectModel<T>[];
		function first() {
			return result[0];
		}

		function all() {
			return result;
		}

		return {
			first,
			all
		};
	}

	async readByPredicate(predicate: SQL, limit?: number, offset?: number) {
		let query = db
			.select()
			.from(this.table as SQLiteTable)
			.where(predicate);
		if (limit) {
			query.limit(limit);
		}
		if (offset) {
			query.offset(offset);
		}
		const result = (await query) as InferSelectModel<T>[];

		function first() {
			if (result.length) {
				return result[0];
			}
		}

		function all() {
			return result;
		}

		return {
			first,
			all
		};
	}

	async deleteByPredicate(predicate: SQL) {
		const result = (await db
			.delete(this.table)
			.where(predicate)
			.returning()) as InferSelectModel<T>[];

		function first() {
			return result[0];
		}

		function all() {
			return result;
		}

		return {
			first,
			all
		};
	}

	async update(id: K, row: Partial<InferInsertModel<T>>) {
		const result = (await db
			.update(this.table)
			.set(row)
			.where(eq(this.idColumn, id))
			.returning()) as InferSelectModel<T>[];
		function first() {
			return result[0];
		}

		function all() {
			return result;
		}

		return {
			first,
			all
		};
	}

	async updateByPredicate(id: K, predicate: SQL, row: Partial<InferInsertModel<T>>) {
		const result = (await db
			.update(this.table)
			.set(row)
			.where(and(eq(this.idColumn, id), predicate))
			.returning()) as InferSelectModel<T>[];

		function first() {
			return result[0];
		}

		function all() {
			return result;
		}

		return {
			first,
			all
		};
	}

	async readAll(limit?: number, offset?: number) {
		const query = db.select().from(this.table as SQLiteTable);
		if (limit) {
			query.limit(limit);
		}
		if (offset) {
			query.offset(offset);
		}
		const result = (await query) as InferSelectModel<T>[];
		return result;
	}

	async upsert(row: Partial<InferInsertModel<T>>) {
		const result = (await db
			.insert(this.table as SQLiteTable)
			.values(row)
			.onConflictDoUpdate({ target: this.idColumn, set: row })
			.returning()) as InferSelectModel<T>[];
		function first() {
			return result[0];
		}

		function all() {
			return result;
		}

		return {
			first,
			all
		};
	}
}
