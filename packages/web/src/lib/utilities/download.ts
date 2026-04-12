function start<T>(data: T, filename: string) {
	const blob = new Blob([JSON.stringify(data)], { type: 'text/plain' });
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
