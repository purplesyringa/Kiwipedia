export default {
	render(params, renderer) {
		return renderer("ambox", {
			type: "style",
			text: "'''Unknown template'''",
			"text-small": `Template '''${params.name}''' was referenced, though is doesn't exist. If it looks like a correct WikiMedia template`
		});
	}
};