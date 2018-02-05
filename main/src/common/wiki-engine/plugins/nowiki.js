import Templates from "../../../wiki-templates/templates.js";
import htmlparser from "../htmlparser.js";
import HTMLHandler from "../htmlhandler.js";
import * as util from "../../../common/util.js";
import * as pluginUtil from "./plugin-util.js";

export function prepareNowiki(html) {
	return pluginUtil.walkHtml(
		html,
		elem => {
			return Templates[`<${elem.name}>`] && Templates[`<${elem.name}>`].nowiki;
		},
		(elem, renderedInside) => {
			return `<kiwipedia-nowiki is="${elem.name}">` +
				Object.keys(elem.attribs || {}).map(key => {
					const value = elem.attribs[key];
					return `<kiwipedia-param name="${key}">${value}</kiwipedia-param>`;
				}).join("") +
				`<kiwipedia-inside value="${util.base64encode(renderedInside)}" />` +
			`</kiwipedia-nowiki>`;
		}
	);
};

export async function renderNowiki(elem, convert, renderTemplate, renderData) {
	let params = await pluginUtil.getParams(convert);

	let inside = pluginUtil.find(elem, "kiwipedia-inside");
	if(inside) {
		inside = util.base64decode(inside.attribs.value);
	} else {
		inside = "";
	}

	params._ = inside;

	const template = `<${elem.attribs.is}>`;

	return await renderTemplate(template, params, renderData);
};