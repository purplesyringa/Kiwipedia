import {getHubList} from "../../common/hub-manager.js";
import Hub, {toSlug} from "../../common/hub.js";
import InstaView from "instaview";
import stringReplaceAsync from "string-replace-async";

export async function init() {
	let hubs = await getHubList();
	hubs = hubs.map(hub => hub.slug);
	hubs = hubs.join("|");

	InstaView.conf.wiki = {
		lang: "language",
		interwiki: hubs,
		default_thumb_width: 180
	};
	InstaView.conf.paths = {
		base_href: "./",
		articles: `ARTICLENAMEGOESHERE`,
		math: "/math/", // TODO
		images: "",
		images_fallback: "", // TODO
		magnify_icon: "" // TODO
	};
};

export async function wikiTextToHTML(wikitext, slug) {
	let html = InstaView.convert(wikitext);

	html = await stringReplaceAsync(html, /ARTICLENAMEGOESHERE(.*?)(['"])/g, async (all, article, quote) => {
		let wiki;

		if(article.indexOf(":") == -1) {
			// Local link
			wiki = slug;
		} else {
			// Interwiki
			article = article.replace(/^:/, "");

			wiki = article.substr(0, article.indexOf(":"));
			article = article.substr(article.indexOf(":") + 1);

			wiki = toSlug(wiki.replace("/", "MYAWESOMECONSTANT")).replace(toSlug("MYAWESOMECONSTANT"), "/");
		}

		article = toSlug(article);

		const hub = new Hub(wiki);
		try {
			await hub.init();
		} catch(e) {
			return `?/wiki/${wiki}/${article}${quote} class='interwiki-invalid'`;
		}

		try {
			await hub.getArticleOrigins(article);
		} catch(e) {
			return `?/wiki/${wiki}/${article}${quote} class='interwiki-error'`;
		}

		return `?/wiki/${wiki}/${article}${quote} class='interwiki-exists'`;
	});

	return html;
};