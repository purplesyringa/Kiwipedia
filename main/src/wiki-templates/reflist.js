export default {
	init() {
		this.refs = [];
	},

	render() {
		const formatAuthor = ref => {
			let author = ref.last ? `${ref.first} ${ref.last}` : ref.author || "";
			return ref.authorlink ? `[[${ref.authorlink}|${author}]]` : author;
		};

		return (
			"<ol>" +
				this.refs.map(ref => {
					console.log(ref);
					return `
						<li>
							<a href="${ref.url}">${ref.title}</a>
							${ref.last || ref.author ? ` &mdash; ${formatAuthor(ref)}` : ""}
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