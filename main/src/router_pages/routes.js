import Home from "./home/home.vue";
import NewHub from "./new-hub.vue";
import HubList from "./hub-list/hub-list.vue";
import InitHub from "./init-hub/init-hub.vue";
import Article from "./article/article.vue";
import Imported from "./imported/imported.vue";
import NewArticle from "./new-article/new-article.vue";
import ImportArticle from "./import-article/import-article.vue";
import EditArticle from "./edit-article/edit-article.vue";
import ArticleHistory from "./article-history/article-history.vue";
import ArticleVersion from "./article-version/article-version.vue";
import ArticleIndex from "./article-index/article-index.vue";
import Settings from "./settings/settings.vue";

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
		path: "imported/:language/:subgroup/:origin/:article",
		controller: () => {
			vue.currentView = Imported;
		}
	},
	{
		path: "imported/:language/:origin/:article",
		controller: () => {
			vue.currentView = Imported;
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
		path: "import-article/:language/:subgroup",
		controller: () => {
			vue.currentView = ImportArticle;
		}
	},
	{
		path: "import-article/:language",
		controller: () => {
			vue.currentView = ImportArticle;
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
	},

	{
		path: "article-index/:language/:subgroup",
		controller: () => {
			vue.currentView = ArticleIndex;
		}
	},
	{
		path: "article-index/:language",
		controller: () => {
			vue.currentView = ArticleIndex;
		}
	},

	{
		path: "settings",
		controller: () => {
			vue.currentView = Settings;
		}
	}
];