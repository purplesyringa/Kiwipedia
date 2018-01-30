import {zeroPage, zeroDB, zeroAuth} from "../route.js";

export async function getHubList() {
	return await zeroDB.query(`
		SELECT
			hubs.*,
			json_content.cert_user_id AS runner
		FROM hubs

		LEFT JOIN json ON (
			hubs.json_id = json.json_id
			AND json.file_name = "data.json"
		)

		LEFT JOIN json AS json_content ON (
			json.directory = json_content.directory
			AND json.site = json_content.site
			AND json_content.file_name = "content.json"
		)

		GROUP BY address
	`);
};