import * as nowiki from "./nowiki.js";

export function prepare(html) {
	return nowiki.prepare(html);
};

export async function render(elem, convert, renderTemplate, renderData) {
	if(elem.name == "plugin-nowiki") {
		return await nowiki.render(elem, convert, renderTemplate, renderData);
	}
}