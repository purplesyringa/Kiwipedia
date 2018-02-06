import Templates from "../../../wiki-templates/templates.js";
import htmlparser from "../htmlparser.js";
import HTMLHandler from "../htmlhandler.js";
import * as util from "../../../common/util.js";
import * as pluginUtil from "./plugin-util.js";

export default {
	name: "nowiki",

	condition(elem) {
		return Templates[`<${elem.name}>`] && Templates[`<${elem.name}>`].nowiki;
	},
	handler(elem, renderedInside) {
		return `<kiwipedia-inside value="${util.base64encode(renderedInside)}" />`;
	},

	async render(elem, convert, renderTemplate, renderData) {
		let params = await pluginUtil.getParams(elem, convert);

		let inside = pluginUtil.find(elem, "kiwipedia-inside");
		if(inside) {
			inside = util.base64decode(inside.attribs.value);
		} else {
			inside = "";
		}

		params._ = inside;

		const template = `<${elem.attribs.is}>`;

		return await renderTemplate(template, params, renderData);
	}
};