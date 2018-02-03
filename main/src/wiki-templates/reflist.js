export default {
	name: "reflist",

	init() {
		this.refs = [];
	},

	async render(params, renderer) {
		return (
			"<ol>" +
				this.refs.map(ref => {
					return `<li>${ref}</li>`;
				}).join("") +
			"</ol>"
		);
	}
};