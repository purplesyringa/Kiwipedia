import Home from "./home/home.vue";

export default (vue, zeroPage) => [
	{
		path: "",
		controller: () => {
			vue.currentView = Home;
		}
	},
	{
		path: "new-language",
		controller: async () => {
			const siteInfo = await zeroPage.getSiteInfo();
			zeroPage.cmd("siteClone", [siteInfo.address, "hub-template"]);
		}
	}
];