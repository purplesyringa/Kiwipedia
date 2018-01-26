export default {
	init() {
		this.refs = [];
	},

	render(params, renderer) {
		const formatAuthor = () => {
			let author = params.last ? `${params.first} ${params.last}` : params.author || "";
			return params.authorlink ? `[[${params.authorlink}|${author}]]` : author;
		};

		const id = this.refs.length + 1;

		const ref = `
			<a href="${params.url}" name="ref_${id}">${params.title}</a>
			${params.last || params.author ? ` &#8212; ${formatAuthor(params)}` : ""}
			${params.description ? ` <i>${params.description}</i>` : ""}
			${params.website || ""}
			${params.publisher ? "published by " + params.publisher : ""}
		`;

		this.refs.push(ref);

		return `<sup><a href="#ref_${id}">[${id}]</a></sup>`;
	}
};