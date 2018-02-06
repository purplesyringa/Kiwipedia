import Templates from "../../wiki-templates/templates.js";
import htmlparser from "./htmlparser.js";
import HTMLHandler from "./htmlhandler.js";
import * as plugins from "./plugins/plugins.js";

export let settings = {renderTemplate: null};


export async function convertTagTemplates(html, renderData, context) {
	const handler = new HTMLHandler(`<div>\n${html}\n</div>`);
	const parser = new htmlparser.Parser(handler);
	parser.parseComplete(`<div>\n${html}\n</div>`);

	const convert = async elem => {
		if(elem.type == "text") {
			return elem.raw;
		} else if(elem.type == "tag") {
			if(elem.name.startsWith("plugin-")) {
				return await plugins.render(elem, convert, settings.renderTemplate, renderData, context);
			}

			let renderedInside = (await Promise.all((elem.children || []).map(convert))).join("");
			return `<${elem.raw}>${renderedInside}</${elem.name}>`;
		}
	};
	return await convert(handler.dom[0]);
};