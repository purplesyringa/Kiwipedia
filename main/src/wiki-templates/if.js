export default {
	async render(params, renderer) {
		if(params[1] == "") {
			// Simple if

			let settings = (params[5] || "").split(",");
			if(params[2].indexOf("was referenced, though is doesn't exist") > -1 && settings.indexOf("-unknown") == -1) {
				return await renderer(
					"ambox",
					{
						type: "serious",
						text: "'''Unknown template'''",
						"text-small": `<code>{{if}}</code> condition is ${params[2]} - probably some template doesn't exist. Check source code and fix the error. If there is no error, pass <code>-unknown</code> flag to <code>{{if}}</code>, like this: <code>{{if||condition|then|else|-unknown}}</code>`
					}
				) + params[3];
			} else if(params[2] != "") {
				return params[3];
			} else {
				return params[4];
			}
		} else {
			return await renderer(
				"unexisting-template",
				{
					name: `if|${params[1]}`
				}
			);
		}
	}
};