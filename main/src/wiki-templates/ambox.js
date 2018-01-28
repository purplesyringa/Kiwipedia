export default {
	async render(params, renderer) {
		return `
			<div class='ambox ${params.type ? `ambox-${params.type}` : "ambox-notice"}'>
				${params.text || ""}
				${params["text-small"] ? `<br />${params["text-small"]}` : ""}
			</div>
		`;
	}
};