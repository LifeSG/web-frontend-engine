// pseudo-random id generator
export const generateRandomId = () =>
	Array(5)
		.fill(0)
		.map(() => Math.random().toString(36).slice(2))
		.join("");
