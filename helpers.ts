export const debounce = <T extends (...args: any[]) => void>(
	fn: T,
	delay: number
) => {
	let timeoutID: ReturnType<typeof setTimeout> | undefined = undefined;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutID);
		timeoutID = setTimeout(() => fn(...args), delay);
	};
};

const obsidianImageWikiRegex = /!\[\[.+\.(png|jpg|jpeg|webp|gif)\s*\|(.+)\]\]/g;
const arbitaryValueRegex = /^w-(.+)/g;

export const collectSizeArbitraryValues = (texts: string[]) => {
	const matchedArbitaryValues: string[] = [];

	for (let te = 0; te < texts.length; te++) {
		const text = texts[te];
		const matchs = obsidianImageWikiRegex.exec(text);

		if (matchs) {
			const [, , match] = matchs;
			match
				.split(" ")
				.map((m) => m.trim())
				.filter(Boolean)
				.forEach((m) => {
					const arbitaryMatch = arbitaryValueRegex.exec(m);
					if (arbitaryMatch) {
						const [, value] = arbitaryMatch;

						matchedArbitaryValues.push(value);
					}
				});
		}
	}

	return matchedArbitaryValues;
};
