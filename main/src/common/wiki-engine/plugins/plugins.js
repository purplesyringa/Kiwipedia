import * as pluginUtil from "./plugin-util.js";


const context = require.context(".", true, /\.js$/);

let Plugins = {};
for(let file of context.keys()) {
	if(file == "./plugins.js" || file == "./plugin-util.js") {
		continue;
	}

	const plugin = context(file);
	Plugins[plugin.name] = plugin;
}

export function prepare(html) {
	return Object.keys(Plugins).reduce((html, name) => {
		const plugin = Plugins[name];
		return pluginUtil.walkHtml(html, plugin.condition, plugin.handler, name);
	}, html);
};

export async function render(elem, convert, renderTemplate, renderData) {
	const name = elem.name.replace(/^plugin-/, "");
	if(!Plugins[name]) {
		return "";
	}

	return await Plugins[name].render(elem, convert, renderTemplate, renderData);
};