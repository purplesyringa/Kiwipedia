export default {
	nowiki: true,
	name: "<original-test>",
	async render(params, renderer) {
		return await renderer(
			"ambox",
			{
				type: "notice",
				text: "'''&lt;original-test&gt;'''",
				"text-small": `
					<div>
						''Original string'': ${
							params._
								.replace(/&/g, "&amp;")
								.replace(/</g, "&lt;")
								.replace(/>/g, "&gt;")
						}<br>
						''Params'': ${
							JSON.stringify(params, (key, value) => key == "_" ? undefined : value)
								.replace(/&/g, "&amp;")
								.replace(/</g, "&lt;")
								.replace(/>/g, "&gt;")
						}
					</div>
				`
			}
		);
	}
};