export default {
	init() {
		this.refs = [];
	},

	render(params, renderer) {
		return (
			"<ol>" +
				this.refs.map(ref => {
					return `<li>${ref}</li>`;
				}).join("") +
			"</ol>"
		);
	}
};