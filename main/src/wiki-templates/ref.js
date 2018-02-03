export default {
	name: "<ref>",

	init() {
		this.refs = [];
		this.refNames = [];
	},

	async render(params, renderer) {
		if(!params.name && !params._) {
			return "";
		}

		if(!params.name) {
			params.name = this.refs.length;
		}

		if(this.refNames.indexOf(params.name) == -1) {
			this.refNames.push(params.name);
			this.refs.push("");
		}
		let id = this.refNames.indexOf(params.name);

		if(params._ != "") {
			this.refs[id] = `
				<div id="ref_${id + 1}">
					${params._}
				</div>
			`;
		}

		return `<sup><a href="#ref_${id + 1}">[${id + 1}]</a></sup>`;
	}
};