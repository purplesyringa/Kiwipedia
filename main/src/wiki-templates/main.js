export default {
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

		if(!params[1]) {
			articles.push(
				{
					link: context.slug,
					label: params["l1"] || params["label 1"] || context.title
				}
			);
		}

		articles = articles.map(article => `[[${article.link}|${article.label}]]`);

		let count;
		if(articles.length > 1) {
			articles = articles.slice(0, articles.length - 1).join(", ") + " and " + articles.slice(-1)[0];
			count = "s";
		} else {
			articles = articles[0];
			count = "";
		}

		return await renderer(
			"hatnote",
			{
				1: `Main article${count}: ${articles}`,
				extraclasses: "main",
				selfref: params.selfref
			}
		);
	}
};