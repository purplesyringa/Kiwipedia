const context = require.context(".", true, /\.js$/);

let Templates = {};
for(let file of context.keys()) {
	if(file == "./templates.js") {
		continue;
	}

	let template = context(file).default;
	Templates[template.name] = template;
}

export default Templates;