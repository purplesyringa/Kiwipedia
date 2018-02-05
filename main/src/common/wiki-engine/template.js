import Templates from "../../wiki-templates/templates.js";
import {parseTemplate} from "./parser.js";


const templateConstant = `MY_AWESOME_TEMPLATE_NUMBER_{{id}}_GOES_HERE_PLEASE_DONT_USE_THIS_CONSTANT_ANYWHERE_IN_ARTICLE`;

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
	const templateRegexp = /MY_AWESOME_TEMPLATE_NUMBER_(.+?)_GOES_HERE_PLEASE_DONT_USE_THIS_CONSTANT_ANYWHERE_IN_ARTICLE/g;

	const rendered = text.replace(templateRegexp, (all, id) => {
		const template = renderingTemplates[id];

		let {name, params} = parseTemplate(template);

		name = name[0].toLowerCase() + name.substr(1);
		if(!Templates[name]) {
			return `
				<kiwipedia-template is="unexisting-template">
					<kiwipedia-param name="name">${name}</kiwipedia-param>
				</kiwipedia-template>
			`.replace(/[\t\n]/g, "");
		}

		for(let paramName of Object.keys(params)) {
			let paramValue = params[paramName];
			paramValue = renderCurlyTemplates(paramValue, renderingTemplates, renderData);
			params[paramName] = paramValue;
		}

		return (
			`<kiwipedia-template is="${name}">` +
				Object.keys(params).map(paramName => {
					let paramValue = params[paramName];
					return `<kiwipedia-param name="${paramName}">${paramValue}</kiwipedia-param>`;
				}).join("") +
			`</kiwipedia-template>`
		);
	});

	return rendered;
};