import Hub, {toSlug} from "../../common/hub.js";
import InstaView from "instaview";
import stringReplaceAsync from "string-replace-async";

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