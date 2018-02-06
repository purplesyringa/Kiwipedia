import * as pluginUtil from "./plugin-util.js";


const context = require.context(".", true, /\.js$/);

let Plugins = {};
for(let file of context.keys()) {
	if(file == "./plugins.js" || file == "./plugin-util.js") {
		continue;
	}

	const plugin = context(file).default;
	Plugins[plugin.name] = plugin;
}

export function prepare(html, context) {
	html = Object.keys(Plugins).reduce((html, name) => {
		const plugin = Plugins[name];
		if(plugin.prepare) {
			return plugin.prepare.call(context, html);
		} else {
			return html;
		}
	}, html);

	html = Object.keys(Plugins).reduce((html, name) => {
		const plugin = Plugins[name];
		return pluginUtil.walkHtml(html, plugin.condition.bind(context), plugin.handler.bind(context), name);
	}, html);

	return html;
};

export async function render(elem, convert, renderTemplate, renderData, context) {
	const name = elem.name.replace(/^plugin-/, "");
	if(!Plugins[name]) {
		return "";
	}

	let params = await pluginUtil.getParams(elem, convert);

	async function renderer(template, params) {
		return await renderTemplate(template, params, renderData);
	};

	return await Plugins[name].render.call(context, pluginUtil.getData(elem), params, renderer);
};