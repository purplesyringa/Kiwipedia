import {zeroPage, zeroDB, zeroAuth} from "../route.js";

export async function getHubList() {
	return await zeroDB.query(`
		SELECT
			hubs.*,
			json.cert_user_id AS runner
		FROM hubs

		LEFT JOIN json USING (json_id)

		GROUP BY address
	`);
};