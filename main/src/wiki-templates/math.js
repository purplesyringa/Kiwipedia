import katex from "katex";

export default {
	async render(params, renderer) {
		try {
			return `<div class="formula">${katex.renderToString(params._)}</div>`;
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