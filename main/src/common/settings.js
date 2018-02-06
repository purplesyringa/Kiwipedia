import {zeroPage, zeroAuth, zeroFS, zeroDB} from "../route.js";

export async function load() {
	await zeroPage.getSiteInfo();

	const auth = await zeroAuth.requestAuth();

	let settings;

	try {
		let data = await zeroFS.readFile(`data/users/${auth.address}/data.json`);
		data = JSON.parse(data);
		settings = data.settings || {};
	} catch(e) {
		settings = {};
	}

	return Object.assign({
		hideUnknownTemplate: false
	}, settings);
};

export async function save(settings) {
	const auth = await zeroAuth.requestAuth();

	let data;
	try {
		data = await zeroFS.readFile(`data/users/${auth.address}/data.json`);
		data = JSON.parse(data);
	} catch(e) {
		data = {};
	}

	data.settings = settings;
	data = JSON.stringify(data, null, 4);
	await zeroFS.writeFile(`data/users/${auth.address}/data.json`, data);

	await zeroPage.publish(`data/users/${auth.address}/content.json`);
};