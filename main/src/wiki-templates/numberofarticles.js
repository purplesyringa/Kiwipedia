import Hub from "../common/hub.js";

export default {
	name: "nUMBEROFARTICLES",
	async render(params, renderer, context) {
		try {
			const hub = new Hub(context.slug);
			await hub.init();

			const index = await hub.getIndex();
			return index.length.toString();
		} catch(e) {
			return await renderer(
				"ambox",
				{
					type: "serious",
					text: "'''Unable to get number of articles'''",
					"text-small": `Could not evaluate {{NUMBEROFARTICLES}}: <code>${e.message}</code>.`
				}
			);
		}
	}
};