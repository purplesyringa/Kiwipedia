export default {
	name: "clear",
	async render(params, renderer) {
		return `<div style="clear: ${params[1] || "both"}" />`;
	}
};