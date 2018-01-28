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
		.replace(/\[([^\[\],]+),([^\[\]]+)\]/g, "[$1 $2]")
		.replace(/\[\//g, "[zero://");

	return wiki;
};

async function importZeroWiki(address, slug) {
	const serverInfo = await zeroPage.cmd("serverInfo");
	if(serverInfo.rev < 3230) {
		throw new Error("Please update ZeroNet to at least rev3230 to import from ZeroWiki.");
	}

	await zeroPage.cmd("corsPermission", [address]);

	let progress = zeroPage.progress("Querying article from database...");
	progress.setPercent(20);

	const versions = await zeroPage.cmd("as", [address, "dbQuery", [`
		SELECT *
		FROM pages

		WHERE slug = :slug

		ORDER BY date_added DESC
		LIMIT 1
	`, {
		slug
	}]]);
	if(versions.length == 0) {
		progress.setPercent(-1);
		throw new NotEnoughError(`No article with slug <b>${slug}</b> was found on ZeroWiki (<b>${address}</b>)`);
	}

	progress.setMessage("Searching for latest version...");
	progress.setPercent(60);

	const latest = versions[0];

	progress.setMessage("Translating Markdown into WikiText...");
	progress.setPercent(80);

	const markdown = markdownToWikiText(latest.body);

	progress.setMessage("Done");
	progress.done();

	return markdown;
};

async function importWikipedia(address, article) {
	const backend = `${address}/w/api.php`;
	const url = `${backend}?action=query&titles=${encodeURIComponent(article)}&prop=revisions&rvprop=content&rvlimit=1&format=json&formatversion=2&origin=*`;

	let progress = zeroPage.progress("Querying article from wikipedia...");
	progress.setPercent(20);

	let query;
	try {
		query = await fetch(url, {
			headers: new Headers({
				"Api-User-Agent": "Kiwipedia/1.0",
				"Content-Type": "application/json; charset=UTF-8"
			})
		});
	} catch(e) {
		progress.setMessage("Failed");
		progress.setPercent(-1);
		throw e;
	}

	progress.setMessage("Parsing result...");
	progress.setPercent(50);

	let parsed;
	try {
		parsed = await query.json();
	} catch(e) {
		progress.setMessage("Failed");
		progress.setPercent(-1);
		throw e;
	}

	progress.setMessage("Done");
	progress.done();

	return parsed.query.pages[0].revisions[0].content;
};

export default async function importer(source) {
	if(source.startsWith("zerowiki://") && source.indexOf("/", "zerowiki://".length) == -1) {
		return await importZeroWiki(zeroWikiAddress, source.replace("zerowiki://", ""));
	} else if(source.startsWith("zerowiki://")) {
		source = source.replace("zerowiki://", "");

		const address = source.substr(0, source.substr(source.indexOf("/")));
		const article = source.substr(source.substr(source.indexOf("/")) + 1);

		return await importZeroWiki(address, article);
	} else if(source.indexOf("/wiki/") > -1) {
		const address = source.substr(0, source.indexOf("/wiki/"));
		const article = source.substr(source.indexOf("/wiki/") + 6).replace(/\/$/, "");

		return await importWikipedia(address, article);
	} else {
		throw new Error(`Unknown source ${source}`);
	}
};