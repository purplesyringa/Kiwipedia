const context = require.context(".", true, /\.js$/);

let Templates = {};
for(let file of context.keys()) {
	if(file == "./templates.js") {
		continue;
	}

	const template = context(file).default;

	let names = template.name;
	if(typeof names == "string") {
		names = [names];
	}

	for(let name of names) {
		Templates[name] = template;
	}
}

export default Templates;