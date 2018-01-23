import Home from "./home/home.vue";
import NewLanguage from "./new-language.vue";

import * as config from "../config.js";

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

			zeroPage.cmd("siteClone", [config.templateAddress]);
		}
	}
];