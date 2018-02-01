import {zeroPage, zeroFS} from "../route.js";
import * as config from "../config.js";

export async function addMergedSite(address) {
	const list = await zeroPage.cmd("mergerSiteList");
	if(list[address]) {
		return;
	}

	await new Promise((resolve, reject) => {
		// Wait for some file to download
		let handler = siteInfo => {
			if(siteInfo.params.address != address) {
				return;
			}

			let event = siteInfo.params.event;
			if(event[0] == "file_done") {
				zeroPage.off("setSiteInfo", handler);
				resolve(true);
			}
		};
		zeroPage.on("setSiteInfo", handler);

		zeroPage.cmd("mergerSiteAdd", [address]);
	});
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