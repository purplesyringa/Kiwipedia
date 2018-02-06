export default {
	name: "unexisting-template",

	async render(params, renderer, context) {
		if(context.settings.hideUnknownTemplate) {
			return "";
		}

		return await renderer("ambox", {
			type: "style",
			text: "'''Unknown template'''",
			"text-small": `Template '''${params.name}''' was referenced, though is doesn't exist. If it looks like a correct WikiMedia template, [[:en/kiwipedia-test:TODO templates|add it to TODO templates]].`
		});
	}
};