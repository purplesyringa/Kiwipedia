import Templates from "../../../wiki-templates/templates.js";

export default {
	name: "template",

	condition(elem) {
		return false;
	},
	handler(elem, renderedInside) {
		return {};
	},

	async render(data, params, renderer) {
		return await renderer(data.is, params);
	}
};