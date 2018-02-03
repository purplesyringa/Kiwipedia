export default {
	name: "cite web",
	async render(params, renderer) {
		const formatAuthor = () => {
			let author = params.last ? `${params.first} ${params.last}` : params.author || "";
			return params.authorlink ? `[[${params.authorlink}|${author}]]` : author;
		};

		return `
			<a href="${params.url}">${params.title}</a>
			${params.last || params.author ? ` &#8212; ${formatAuthor(params)}` : ""}
			${params.description ? ` <i>${params.description}</i>` : ""}
			${params.website || ""}
			${params.publisher ? "published by " + params.publisher : ""}
		`;
	}
};