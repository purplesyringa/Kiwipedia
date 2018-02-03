export default {
	name: "<syntaxhighlight>",
	async render(params, renderer) {
		return `<pre>${params.original.replace(/\n/g, "<br>")}</pre>`;
	}
};