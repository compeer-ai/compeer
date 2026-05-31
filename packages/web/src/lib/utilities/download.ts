function start<T>(data: T, filename: string, type = 'text/plain') {
	const content = typeof data === 'string' ? data : JSON.stringify(data);
	const blob = new Blob([content], { type });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}

export const download = {
	start
};
