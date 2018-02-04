export default {
	name: "sidebar",
	async render(params, renderer) {
		let headings = [];
		for(let i = 1; i <= 35 && params[`content${i}`]; i++) {
			let heading = params[`heading${i}`];
			heading = heading ? `<b>${heading}</b><br>` : "";
			headings.push(heading + params[`content${i}`] + "<br>");
		}
		headings = headings.join("");

		return `
			<div class="sidebar-container">
				${params.outertitle}

				<div class="sidebar">
					${params.topimage || ""}

					${params.pretitle ? params.pretitle + "<br>" : ""}
					${params.title ? `<h3>${params.title}</h3>` : ""}

					${params.image || ""}

					${headings}

					<br>
					${params.name ? `<small>Template: ${params.name}</small>` : ""}
				</div>
			</div>
		`;
	}
};