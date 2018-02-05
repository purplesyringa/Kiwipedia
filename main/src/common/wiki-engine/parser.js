export function parseTemplateParams(params, trim=true) {
	let index = 1;
	let res = {};

	params.split("|").forEach(param => {
		if(trim) {
			if(param.indexOf("=") == -1) {
				res[index++] = param;
			} else {
				let name = param.substr(0, param.indexOf("=")).trim();
				let value = param.substr(param.indexOf("=") + 1).trim();
				res[name] = value;
			}
		} else {
			res[index++] = param.trim();
		}
	});

	return res;
};

export function parseTemplate(template) {
	if(template[0] == "#") {
		let name = template.substr(0, template.indexOf(":"));
		let params = template.substr(template.indexOf(":") + 1);

		return {
			name: name.trimLeft(),
			params: parseTemplateParams(params, false)
		};
	}

	let match = template.match(/^([^#<>\[\]\|\{\}]+?)\|([\s\S]*)$/);
	if(match) {
		return {
			name: match[1].trim(),
			params: parseTemplateParams(match[2])
		};
	}

	match = template.match(/^([^#<>\[\]\|\{\}]+?)$/);
	if(match) {
		return {
			name: match[1].trim(),
			params: {}
		};
	}

	return {
		name: "invalid-template",
		params: {
			code: template
		}
	};
};