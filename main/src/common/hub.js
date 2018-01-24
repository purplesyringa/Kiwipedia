import {zeroPage, zeroDB} from "../route.js";

export default class Hub {
	constructor(slug) {
		this.slug = slug;
	}

	async init() {
		this.address = await Hub.slugToAddress(this.slug);
	}

	static async slugToAddress(slug) {
		const result = await zeroDB.query(`
			SELECT *
			FROM hubs

			WHERE slug = :slug
			GROUP BY address
		`, {slug});

		if(result.length == 0) {
			throw new RangeError(`No addresses found for slug ${slug}`);
		} else if(result.length > 1) {
			throw new RangeError(`${result.length} addresses found for slug ${slug}`);
		}

		return result[0].address;
	}
};