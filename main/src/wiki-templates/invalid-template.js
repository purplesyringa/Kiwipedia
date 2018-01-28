export default {
	async render(params, renderer) {
		return await renderer("ambox", {
			type: "serious",
			text: "'''Invalid template'''",
			"text-small": `Code <code>{{${params.code}}}</code> was used as a template, though it looks like invalid syntax. If you think the syntax is correct, [[:en/kiwipedia-test:TODO templates|add it to TODO templates]].`
		});
	}
};