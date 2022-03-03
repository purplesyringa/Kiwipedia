import Templates from "../../../wiki-templates/templates.js";
import * as util from "../../../common/util.js";

export default {
	name: "nowiki",

	condition(elem) {
		return Templates[`<${elem.name}>`] && Templates[`<${elem.name}>`].nowiki;
	},
	handler(elem, renderedInside) {
		return {
			inside: renderedInside
		};
	},

	async render(data, params, renderer) {
		params._ = data.inside;
		return await renderer(`<${params._name}>`, params);
	}
};