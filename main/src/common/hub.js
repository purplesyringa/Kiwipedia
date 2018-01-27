import {zeroPage, zeroDB, zeroAuth} from "../route.js";
import startup, {addMergedSite} from "./startup.js";

export function toSlug(s) {
	return s.replace(/[^a-zA-Z0-9]/g, "-").replace(/-+/g, "-").toLowerCase();
};

class NotEnoughError extends Error {};
class TooMuchError extends Error {};
export {NotEnoughError, TooMuchError};

export default class Hub {
	constructor(slug) {
		this.slug = slug;
	}

	async init() {
		await startup();

		const data = await Hub.slugToData(this.slug);
		this.address = data.address;
		this.language = data.language;
		this.subgroup = data.subgroup;

		await addMergedSite(this.address);
	}

	async getIndex() {
		return await zeroDB.query(`
			SELECT
				article.title,
				article.text,
				article.slug,
				MAX(article.date_updated) AS date_updated,
				article.imported,
				article.json_id
			FROM article

			LEFT JOIN json
			USING (json_id)

			WHERE json.directory LIKE "${this.address}/%"
			AND json.site = "merged-ZeroWikipedia"

			GROUP BY article.slug
		`);
	}

	async getArticle(slug, importOrigin="") {
		const res = await zeroDB.query(`
			SELECT *
			FROM article

			LEFT JOIN json
			USING (json_id)

			WHERE slug = :slug
			AND json.directory LIKE "${this.address}/%"
			AND json.site = "merged-ZeroWikipedia"
			AND imported = :importOrigin

			ORDER BY date_updated DESC

			LIMIT 1
		`, {slug, importOrigin});

		if(res.length == 0) {
			throw new NotEnoughError(`No articles found for slug ${slug} in hub ${this.slug}`);
		}

		return res[0];
	}
	async getAritcleOrigins(slug) {
		const res = await zeroDB.query(`
			SELECT *
			FROM article

			LEFT JOIN json
			USING (json_id)

			WHERE slug = :slug
			AND json.directory LIKE "${this.address}/%"
			AND json.site = "merged-ZeroWikipedia"

			GROUP BY imported
		`, {slug});

		if(res.length == 0) {
			throw new NotEnoughError(`No articles found for slug ${slug} in hub ${this.slug}`);
		}

		return res.map(row => row.imported);
	}
	async getArticleVersion(slug, date) {
		const res = await zeroDB.query(`
			SELECT *
			FROM article

			LEFT JOIN json
			USING (json_id)

			WHERE slug = :slug
			AND json.directory LIKE "${this.address}/%"
			AND json.site = "merged-ZeroWikipedia"
			AND article.date_updated = :date

			LIMIT 1
		`, {slug, date});

		if(res.length == 0) {
			throw new NotEnoughError(`No article found for slug ${slug} and version ${date} in hub ${this.slug}`);
		}

		return res[0];
	}
	async getArticleHistory(slug) {
		return await zeroDB.query(`
			SELECT *
			FROM article

			LEFT JOIN json
			USING (json_id)

			WHERE slug = :slug
			AND json.directory LIKE "${this.address}/%"
			AND json.site = "merged-ZeroWikipedia"

			ORDER BY date_updated DESC
		`, {slug});
	}

	async publishArticle(title, text, imported="") {
		const auth = await zeroAuth.requestAuth();

		const slug = toSlug(title);

		await zeroDB.insertRow(
			`merged-ZeroWikipedia/${this.address}/data/users/${auth.address}/data.json`,
			`merged-ZeroWikipedia/${this.address}/data/users/${auth.address}/content.json`,
			"article",
			{
				title,
				text,
				slug,
				date_updated: Date.now(),
				imported: imported
			}
		);

		return slug;
	}

	static async slugToData(slug) {
		const result = await zeroDB.query(`
			SELECT *
			FROM hubs

			WHERE slug = :slug
			GROUP BY address
		`, {slug});

		if(result.length == 0) {
			throw new NotEnoughError(`No addresses found for hub slug ${slug}`);
		} else if(result.length > 1) {
			throw new TooMuchError(`${result.length} addresses found for hub slug ${slug}`);
		}

		return result[0];
	}
};