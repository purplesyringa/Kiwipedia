export default {
	name: "original test",
	async render(params, renderer) {
		return await renderer(
			"ambox",
			{
				type: "notice",
				text: "'''{{original test}}'''",
				"text-small": `
					<div>
						''Original string'': ${
							params.original
								.replace(/&/g, "&amp;")
								.replace(/</g, "&lt;")
								.replace(/>/g, "&gt;")
						}<br>
						''Params'': ${
							JSON.stringify(params)
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