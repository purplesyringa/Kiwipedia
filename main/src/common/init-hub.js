import {zeroFS, zeroAuth, zeroDB, zeroPage} from "../route.js";

async function addToIndex(language, subgroup, address) {
	const auth = await zeroAuth.requestAuth();

	await zeroDB.insertRow(
		`data/users/${auth.address}/data.json`,
		`data/users/${auth.address}/content.json`,
		"hubs",
		{
			language,
			subgroup,
			address,
			slug: subgroup.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-")
		}
	);
};

export default async function init(language, subgroup, address) {
	const path = `merged-ZeroWikipedia/${address}/content.json`;

	let content = await zeroFS.readFile(path);
	content = JSON.parse(content);

	content.title = `ZeroWikipedia hub | ${language}` + (subgroup && ` | ${subgroup}`);

	content = JSON.stringify(content, null, 4);
	await zeroFS.writeFile(path, content);
	await zeroPage.sign(path);

	await addToIndex(language, subgroup, address);
};