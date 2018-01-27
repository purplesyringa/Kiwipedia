import {zeroWikiAddress} from "../config.js";
import {addMergedSite} from "./startup.js";
import {zeroPage, zeroFS, zeroDB} from "../route.js";
import {NotEnoughError, TooMuchError} from "./hub.js";
import {markdown2wiki} from "markdown-wiki";

function markdownToWikiText(markdown) {
	markdown = markdown
		.replace(/\[\[(.*?)\]\]/g, (all, article) => {
			let label = article;
			if(article.indexOf("|") > -1) {
				label = article.substr(article.indexOf("|") + 1);
				article = article.substr(0, article.indexOf("|"));
			}

			return `[BEGINMARKDOWNLABEL${label}ENDMARKDOWNLABEL](BEGINMARKDOWNARTICLE${article}ENDMARKDOWNARTICLE)`;
		});

	let wiki = markdown2wiki(markdown);
	wiki = wiki
		.replace(/\[BEGINMARKDOWNARTICLE(.*?)ENDMARKDOWNARTICLE,BEGINMARKDOWNLABEL(.*?)ENDMARKDOWNLABEL\]/g, (all, article, label) => {
			if(article == label) {
				return `[[${article}]]`;
			} else {
				return `[[${article}|${label}]]`;
			}
		})
		.replace(/_([^_]*)_/g, "<strong>$1</strong>")
		.replace(/\[img:(.*?)\]/g, (all, img) => {
			return `{{external media|image1=${img}}}`;
		})
		.replace(/\[([^\[\]]+),([^\[\]]+)\]/g, "[$1 $2]")
		.replace(/\[\//g, "[zero://");

	return wiki;
}

async function importZeroWiki(address, slug) {
	await zeroPage.cmd("corsPermission", [address]);

	let progress = zeroPage.progress("Querying article from database...");
	progress.setPercent(20);

	const versions = await zeroPage.cmd("fileQuery", [`cors-${address}/data/users/*/data.json`, `pages.slug=${slug}`])
	if(versions.length == 0) {
		progress.setPercent(-1);
		throw new NotEnoughError(`No article with slug <b>${slug}</b> was found on ZeroWiki (<b>${address}</b>)`);
	}

	progress.setMessage("Searching for latest version...");
	progress.setPercent(60);

	const latest = versions.reduce((a, b) => {
		if(a.date_added < b.date_added) {
			return b;
		} else {
			return a;
		}
	});

	progress.setMessage("Translating Markdown into WikiText...");
	progress.setPercent(80);

	const markdown = markdownToWikiText(latest.body);

	progress.setMessage("Done");
	progress.done();

	return markdown;
}

export default async function importer(source) {
	if(source.startsWith("zerowiki://") && source.indexOf("/", "zerowiki://".length) == -1) {
		return await importZeroWiki(zeroWikiAddress, source.replace("zerowiki://", ""));
	} else if(source.startsWith("zerowiki://")) {
		source = source.replace("zerowiki://", "");

		const address = source.substr(0, source.substr(source.indexOf("/")));
		const article = source.substr(source.substr(source.indexOf("/")) + 1);

		return await importZeroWiki(address, article);
	} else {
		throw new Error(`Unknown source ${source}`);
	}
};