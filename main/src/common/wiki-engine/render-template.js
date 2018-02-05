import Templates from "../../wiki-templates/templates.js";
import * as util from "../../common/util.js";

export default function init(context) {
	return async function renderTemplate(template, params, renderData) {
		const renderer = async (template, params) => {
			return await renderTemplate(template, params, renderData);
		};

		template = template[0].toLowerCase() + template.substr(1);
		if(!Templates[template]) {
			return await renderTemplate("unexisting-template", {
				name: template
			}, renderData);
		}

		let rendered = (await Templates[template].render.call(renderData, params, renderer, context))
			.trim()
			.replace(/\n/g, "");

		if(/^<.*>$/.test(template) && Templates[template].afterRender) {
			let attribs = (
				Object.keys(params)
					.filter(name => name != "_")
					.map(name => {
						return {
							name: name,
							value: params[name]
								.replace(/&/g, "&amp;")
								.replace(/"/g, "&quot;")
						};
					})
					.map(({name, value}) => `${name}="${value}"`)
					.join(" ")
			)

			const tagName = template.match(/^<(.*)>$/)[1];
			rendered = `<rendered-${tagName} ${attribs}>${util.base64encode(rendered)}</rendered-${tagName}>`;
		}

		return rendered;
	};
};