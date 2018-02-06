import Templates from "../../wiki-templates/templates.js";
import htmlparser from "./htmlparser.js";
import HTMLHandler from "./htmlhandler.js";
import {parseTemplate} from "./parser.js";
import * as plugins from "./plugins/plugins.js";
import * as util from "../util.js";

export let settings = {renderTemplate: null};


const templateConstant = `MY_AWESOME_TEMPLATE_NUMBER_{{id}}_GOES_HERE_PLEASE_DONT_USE_THIS_CONSTANT_ANYWHERE_IN_ARTICLE`;
const templateRegexp = /MY_AWESOME_TEMPLATE_NUMBER_(.+?)_GOES_HERE_PLEASE_DONT_USE_THIS_CONSTANT_ANYWHERE_IN_ARTICLE/g;

export function replaceTemplates(text) {
	let lastTemplateId = 0;

	const renderingTemplates = {};

	// Remove <!-- --> comments
	text = text.replace(/<!--[\s\S]*?-->/g, "");

	// First, replace {{templates}} with constants
	let replaced = text, oldReplaced;
	do {
		oldReplaced = replaced;
		replaced = replace(replaced, template => {
			const id = lastTemplateId++;
			renderingTemplates[id] = template;
			return templateConstant.replace("{{id}}", id);
		});
	} while(oldReplaced != replaced);

	return {renderingTemplates, replaced};
};

function replace(text, callback) {
	return text
		.replace(/{{/g, "\x00")
		.replace(/}}/g, "\x01")
		.replace(/\x00([^\x00\x01]*?)\x01/g, (all, template) => {
			return callback(template);
		})
		.replace(/\x00/g, "{{")
		.replace(/\x01/g, "}}");
};


export function renderCurlyTemplates(text, renderingTemplates, renderData) {
	const rendered = text.replace(templateRegexp, (all, id) => {
		const template = renderingTemplates[id];

		let {name, params} = parseTemplate(template);

		name = name[0].toLowerCase() + name.substr(1);
		if(!Templates[name]) {
			return `
				<plugin-template>
					<kiwipedia-data key="${util.base64encode("is")}" value="${util.base64encode("unknown-template")}" />
					<kiwipedia-param name="name">${name}</kiwipedia-param>
				</plugin-template>
			`.replace(/[\t\n]/g, "");
		}

		for(let paramName of Object.keys(params)) {
			let paramValue = params[paramName];
			paramValue = renderCurlyTemplates(paramValue, renderingTemplates, renderData);
			params[paramName] = paramValue;
		}

		return (
			`<plugin-template>
				<kiwipedia-data key="${util.base64encode("is")}" value="${util.base64encode(name)}" />` +
				Object.keys(params).map(paramName => {
					let paramValue = params[paramName];
					return `<kiwipedia-param name="${paramName}">${paramValue}</kiwipedia-param>`;
				}).join("") +
			`</plugin-template>`
		);
	});

	return rendered;
};


export async function convertTagTemplates(html, renderData) {
	const handler = new HTMLHandler(`<div>\n${html}\n</div>`);
	const parser = new htmlparser.Parser(handler);
	parser.parseComplete(`<div>\n${html}\n</div>`);

	const convert = async elem => {
		if(elem.type == "text") {
			return elem.raw;
		} else if(elem.type == "tag") {
			if(elem.name.startsWith("plugin-")) {
				return await plugins.render(elem, convert, settings.renderTemplate, renderData);
			}

			let renderedInside = (await Promise.all((elem.children || []).map(convert))).join("");
			return `<${elem.raw}>${renderedInside}</${elem.name}>`;
		}
	};
	return await convert(handler.dom[0]);
};