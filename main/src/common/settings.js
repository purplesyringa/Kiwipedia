import {zeroPage, zeroAuth, zeroFS} from "../route.js";

export async function load() {
	await zeroPage.getSiteInfo();

	const auth = await zeroAuth.requestAuth();

	let settings;

	try {
		settings = await zeroFS.readFile(`data/users/${auth.address}/data.json`);
		settings = JSON.parse(settings);
	} catch(e) {
		settings = {};
	}

	return Object.assign({
		hideUnknownTemplate: false
	}, settings);
};