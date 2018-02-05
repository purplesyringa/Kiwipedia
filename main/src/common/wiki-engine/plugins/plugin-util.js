import htmlparser from "../htmlparser.js";
import HTMLHandler from "../htmlhandler.js";

export function walkHtml(html, condition, handler) {
	const htmlHandler = new HTMLHandler(`<div>\n${html}\n</div>`);
	const parser = new htmlparser.Parser(htmlHandler);
	parser.parseComplete(`<div>\n${html}\n</div>`);

	const getInside = elem => {
		const first = htmlHandler.tokens[elem.openTokenId];
		const last = htmlHandler.tokens[elem.closeTokenId];

		return `<div>\n${html}\n</div>`.substring(first.to + 1, last.from - 1);
	};

	const convert = elem => {
		if(elem.type == "text") {
			return elem.raw;
		} else if(elem.type == "tag") {
			if(condition(elem)) {
				const renderedInside = getInside(elem);
				return handler(elem, renderedInside);
			}

			let renderedInside = (elem.children || []).map(convert).join("");

			return `<${elem.raw}>${renderedInside}</${elem.name}>`;
		}
	};
	return convert(htmlHandler.dom[0]);
};