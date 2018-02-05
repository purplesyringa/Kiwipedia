import * as nowiki from "./nowiki.js";
import * as pluginUtil from "./plugin-util.js";

export function prepare(html) {
	return pluginUtil.walkHtml(html, nowiki.condition, nowiki.handler, "nowiki");
};

export async function render(elem, convert, renderTemplate, renderData) {
	if(elem.name == "plugin-nowiki") {
		return await nowiki.render(elem, convert, renderTemplate, renderData);
	}
}