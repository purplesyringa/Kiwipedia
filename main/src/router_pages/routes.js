import Home from "./home/home.vue";
import NewLanguage from "./new-language.vue";

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
			vue.currentView = NewLanguage;

			const siteInfo = await zeroPage.getSiteInfo();
			zeroPage.cmd("siteClone", [siteInfo.address, "hub-template"]);
		}
	}
];