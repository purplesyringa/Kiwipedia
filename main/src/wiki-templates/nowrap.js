export default {
	async render(params, renderer) {
		return `
			<span class="nowrap">${params[1]}</span>
		`;
	}
};