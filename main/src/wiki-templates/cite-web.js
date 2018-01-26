export default {
	init() {
		this.refs = [];
	},

	render(params, renderer) {
		const id = this.refs.push(params);

		return `<sup><a href="#ref_${id}">[${id}]</a></sup>`;
	}
};