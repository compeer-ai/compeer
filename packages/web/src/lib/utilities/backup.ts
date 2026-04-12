const SQLITE_FILE = 'sqlite.db';

async function readSqliteBackupFile() {
	const file = Bun.file(SQLITE_FILE);
	const exists = await file.exists();
	if (!exists) {
		return null;
	}
	return file;
}

export const backup = {
	readSqliteBackupFile
};
