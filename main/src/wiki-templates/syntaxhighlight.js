export default {
	nowiki: true,
	name: "<syntaxhighlight>",
	async render(params, renderer) {
		return `<pre>${
			params._
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/\n/g, "<br>")
		}</pre>`;
	}
};