function choice(...choices: number[]) {
	return choices[Math.floor(Math.random() * choices.length)];
}

export const random = {
	choice
};
