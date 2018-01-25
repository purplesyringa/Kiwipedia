export default {
	render(params, renderer) {
		return `
			<div class='ambox'>
				${params.text || ""}
				${params["text-small"] ? `<br>${params["text-small"]}` : ""}
			</div>
		`;
	}
};