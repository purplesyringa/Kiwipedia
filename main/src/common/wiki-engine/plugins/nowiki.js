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
		return {
			template: elem.name,
			inside: renderedInside
		};
	},

	async render(data, params, renderer) {
		params._ = data.inside;
		return await renderer(`<${data.template}>`, params);
	}
};