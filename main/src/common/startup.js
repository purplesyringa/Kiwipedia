import {zeroPage, zeroFS} from "../route.js";
import * as config from "../config.js";

export async function addMergedSite(address) {
	const list = await zeroPage.cmd("mergerSiteList");
	if(list[address]) {
		return;
	}

	await zeroPage.cmd("mergerSiteAdd", [address]);

	await zeroFS.readFile("merged-Kiwipedia/" + address + "/content.json");
}


async function startup() {
	const siteInfo = await zeroPage.getSiteInfo();

	if(siteInfo.settings.permissions.indexOf("Merger:Kiwipedia") == -1) {
		await zeroPage.cmd("wrapperPermissionAdd", ["Merger:Kiwipedia"]);
	}
};
export default startup;

export async function loadAdditional() {
	await startup();
	await addMergedSite(config.templateAddress);
};