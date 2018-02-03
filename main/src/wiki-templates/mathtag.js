import katex from "katex/katex.js";

export default {
	name: "<math>",
	async render(params, renderer) {
		return `${params._}`;
	},
	async afterRender(params, renderer) {
		try {
			return `<span class="math">${katex.renderToString(params._)}</span>`;
		} catch(e) {
			if(e instanceof katex.ParseError) {
				return await renderer(
					"ambox",
					{
						type: "serious",
						text: "Incorrect formula",
						"text-small": `Formula <code>${params._}</code> is incorrect.`
					}
				);
			} else {
				return await renderer(
					"ambox",
					{
						type: "serious",
						text: "Error during rendering formula",
						"text-small": e.message
					}
				);
			}
		}
	}
};