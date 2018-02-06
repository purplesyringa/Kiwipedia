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
		return `
			<kiwipedia-template value="${util.base64encode(elem.name)}" />
			<kiwipedia-inside value="${util.base64encode(renderedInside)}" />
		`;
	},

	async render(elem, params, renderer) {
		let inside = pluginUtil.find(elem, "kiwipedia-inside");
		if(inside) {
			inside = util.base64decode(inside.attribs.value);
		} else {
			inside = "";
		}

		params._ = inside;

		let template = util.base64decode(pluginUtil.find(elem, "kiwipedia-template").attribs.value);
		template = `<${template}>`;

		return await renderer(template, params);
	}
};