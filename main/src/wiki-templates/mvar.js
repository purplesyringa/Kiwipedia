export default {
	name: "mvar",
	async render(params, renderer) {
		return `
			<span class="math-template mvar">${params[1]}</span>
		`;
	}
};