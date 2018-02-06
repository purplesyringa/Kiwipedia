import Templates from "../../../wiki-templates/templates.js";

export default {
	name: "template",

	condition(elem) {
		return Templates[`<${elem.name}>`];
	},
	handler(elem, renderedInside) {
		return {
			is: `<${elem.name}>`,
			_: renderedInside
		};
	},

	async render(data, params, renderer) {
		params._ = data._;
		return await renderer(data.is, params);
	}
};