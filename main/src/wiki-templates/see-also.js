export default {
	name: "see also",

	async render(params, renderer, context) {
		let articles = [];
		for(let i = 1; params[i] !== undefined; i++) {
			articles.push(
				{
					link: params[i],
					label: params[`l${i}`] || params[`label ${i}`] || params[i]
				}
			);
		}

		articles = articles.map(article => `[[${article.link}|${article.label}]]`).join(", ");

		return await renderer(
			"hatnote",
			{
				1: `See also: ${articles}`,
				extraclasses: "see-also",
				selfref: params.selfref
			}
		);
	}
};