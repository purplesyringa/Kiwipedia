import Home from "./home/home.vue";
import NewHub from "./new-hub.vue";
import HubList from "./hub-list/hub-list.vue";
import InitHub from "./init-hub/init-hub.vue";
import Article from "./article/article.vue";
import NewArticle from "./new-article/new-article.vue";
import EditArticle from "./edit-article/edit-article.vue";
import ArticleHistory from "./article-history/article-history.vue";
import ArticleVersion from "./article-version/article-version.vue";

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
		path: "hub-list",
		controller: async () => {
			vue.currentView = HubList;
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
	},

	{
		path: "new-article/:language/:subgroup",
		controller: () => {
			vue.currentView = NewArticle;
		}
	},
	{
		path: "new-article/:language",
		controller: () => {
			vue.currentView = NewArticle;
		}
	},

	{
		path: "edit-article/:language/:subgroup/:article",
		controller: () => {
			vue.currentView = EditArticle;
		}
	},
	{
		path: "edit-article/:language/:article",
		controller: () => {
			vue.currentView = EditArticle;
		}
	},

	{
		path: "article-history/:language/:subgroup/:article",
		controller: () => {
			vue.currentView = ArticleHistory;
		}
	},
	{
		path: "article-history/:language/:article",
		controller: () => {
			vue.currentView = ArticleHistory;
		}
	},

	{
		path: "article-version/:language/:subgroup/:article/:date",
		controller: () => {
			vue.currentView = ArticleVersion;
		}
	},
	{
		path: "article-version/:language/:article/:date",
		controller: () => {
			vue.currentView = ArticleVersion;
		}
	}
];