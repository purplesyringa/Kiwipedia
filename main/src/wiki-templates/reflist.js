export default {
	init() {
		this.refs = [];
	},

	render(params, renderer) {
		const formatAuthor = ref => {
			let author = ref.last ? `${ref.first} ${ref.last}` : ref.author || "";
			return ref.authorlink ? `[[${ref.authorlink}|${author}]]` : author;
		};

		return (
			"<ol>" +
				this.refs.map(ref => {
					return `
						<li>
							<a href="${ref.url}">${ref.title}</a>
							${ref.last || ref.author ? ` &#8212; ${formatAuthor(ref)}` : ""}
							${ref.description ? ` <i>${ref.description}</i>` : ""}
							${ref.website || ""}
							${ref.publisher ? "published by " + ref.publisher : ""}
						</li>
					`;
				}).join("") +
			"</ol>"
		);
	}
};