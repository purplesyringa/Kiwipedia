export default {
	name: "math",
	async render(params, renderer) {
		return `
			<span class="formula">${params[1]}</span>
		`;
	}
};