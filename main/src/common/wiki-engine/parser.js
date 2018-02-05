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