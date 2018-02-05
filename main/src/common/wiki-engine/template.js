export function replaceTemplates(text) {
	let lastTemplateId = 0;

	const templateConstant = `MY_AWESOME_TEMPLATE_NUMBER_{{id}}_GOES_HERE_PLEASE_DONT_USE_THIS_CONSTANT_ANYWHERE_IN_ARTICLE`;

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