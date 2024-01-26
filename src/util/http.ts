export async function get(url: string) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error('Oh oh! Failed fetching data. :(');
	}

	return (await response.json()) as unknown;
}
