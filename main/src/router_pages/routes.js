import Home from "./home/home.vue";
import NewHub from "./new-hub.vue";
import InitHub from "./init-hub/init-hub.vue";
import Article from "./article/article.vue";

import * as config from "../config.js";
import {loadAdditional} from "../common/startup.js";

export default (vue, zeroPage) => [
	{
		path: "",
		controller: () => {
			vue.currentView = Home;
		}
	},
	{
		path: "new-hub",
		controller: async () => {
			vue.currentView = NewHub;

			await loadAdditional();
			zeroPage.cmd("siteClone", [config.templateAddress]);
		}
	},
	{
		path: "init-hub/:address",
		controller: () => {
			vue.currentView = InitHub;
		}
	},

	{
		path: "wiki/:language/:subgroup/:article",
		controller: () => {
			vue.currentView = Article;
		}
	},
	{
		path: "wiki/:language/:article",
		controller: () => {
			vue.currentView = Article;
		}
	}
];