import * as util from "../../../common/util.js";
import htmlparser from "../htmlparser.js";
import HTMLHandler from "../htmlhandler.js";

export function walkHtml(html, condition, handler, name) {
	const htmlHandler = new HTMLHandler(`<div>\n${html}\n</div>`);
	const parser = new htmlparser.Parser(htmlHandler);
	parser.parseComplete(`<div>\n${html}\n</div>`);

	const getInside = elem => {
		if(elem.forceVoid) {
			return "";
		}

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

				const params = Object.keys(elem.attribs || {}).map(key => {
					const value = elem.attribs[key];
					return `<kiwipedia-param name="${key}">${value}</kiwipedia-param>`;
				}).join("");

				let data = [];
				const obj = handler(elem, renderedInside);
				Object.keys(obj).forEach(key => {
					const value = obj[key];
					data.push(`<kiwipedia-data key="${util.base64encode(key)}" value="${util.base64encode(value)}" />`);
				});
				data = data.join("");

				return `
					<plugin-${name}>
						${params}
						${data}
					</plugin-${name}>
				`;
			}

			let renderedInside = (elem.children || []).map(convert).join("");

			return `<${elem.raw}>${renderedInside}</${elem.name}>`;
		}
	};
	return convert(htmlHandler.dom[0]);
};

export function find(elem, tagName) {
	const child = (elem.children || [])
		.find(child => child.type == "tag" && child.name == tagName);

	return child || null;
};
export function findAll(elem, tagName) {
	const children = (elem.children || [])
		.filter(child => child.type == "tag" && child.name == tagName);

	return children;
};

export async function getParams(elem, convert) {
	let params = {};

	for(const child of findAll(elem, "kiwipedia-param")) {
		const paramName = child.attribs.name;
		const paramValue = (await Promise.all((child.children || []).map(convert))).join("");

		params[paramName] = paramValue;
	}

	return params;
};

export function getData(elem) {
	let data = {};
	for(let child of findAll(elem, "kiwipedia-data")) {
		const key = util.base64decode(child.attribs.key);
		const value = util.base64decode(child.attribs.value);
		data[key] = value;
	}
	return data;
};