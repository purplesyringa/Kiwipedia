import {zeroFS, zeroAuth, zeroDB, zeroPage} from "../route.js";

import {addMergedSite} from "./startup.js";
import {toSlug} from "./hub.js";

async function addToIndex(language, subgroup, address) {
	const auth = await zeroAuth.requestAuth();

	const slug = toSlug(language) + (subgroup && "/" + toSlug(subgroup));

	await zeroDB.insertRow(
		`data/users/${auth.address}/data.json`,
		`data/users/${auth.address}/content.json`,
		"hubs",
		{language, subgroup, address, slug}
	);

	return slug;
};

export default async function init(language, subgroup, address) {
	await addMergedSite(address);

	const path = `merged-ZeroWikipedia/${address}/content.json`;

	let content = await zeroFS.readFile(path);
	content = JSON.parse(content);

	content.title = `ZeroWikipedia hub | ${language}` + (subgroup && ` | ${subgroup}`);

	content = JSON.stringify(content, null, 4);
	await zeroFS.writeFile(path, content);
	await zeroPage.sign(path);

	return await addToIndex(language, subgroup, address);
};