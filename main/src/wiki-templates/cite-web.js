export default {
	init() {
		this.refs = [];
	},

	render(params) {
		const id = this.refs.push(params) - 1;

		return ` [${params.url} ${params.title}] `;
	}
};