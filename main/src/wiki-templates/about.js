export default {
	async render(params, renderer, context) {
		const thisIsAbout = params[1];

		let uses = [];
		for(let i = 2; params[i] !== undefined; i += 2) {
			const use = params[i] || "other uses";
			const title = params[i + 1] || `${title} (disambiguation)`;
			uses.push({use, title});
		}

		uses = uses.map(use => `For ${use.use}, see [[${use.title}]].`).join(" ");

		const item = params.section == "yes" ? "section" : "page";

		return await renderer(
			"hatnote",
			{
				1: `This ${item} is about ${thisIsAbout}. ${uses}`,
				extraclasses: "about"
			}
		);
	}
};