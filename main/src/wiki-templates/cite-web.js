export default {
	init() {
		this.refs = [];
	},

	render(params, renderer) {
		const id = this.refs.push(params);

		return `<sup><a href="${params.url}">[${id}]</a></sup>`;
	}
};