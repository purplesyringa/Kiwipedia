<template>
	<div v-html="rendered"></div>
</template>

<script type="text/javascript">
	import InstaView from "instaview";
	import Templates from "../../wiki-templates/templates.js";

	export default {
		name: "markdown-article",
		props: ["text", "slug"],
		created() {
			InstaView.conf.wiki = {
				lang: "language",
				interwiki: "",
				default_thumb_width: 180
			};
			InstaView.conf.paths = {
				base_href: "./",
				articles: `?/wiki/${this.slug}/`,
				math: "/math/", // TODO
				images: "",
				images_fallback: "", // TODO
				magnify_icon: "" // TODO
			};
		},
		data() {
			return {
				text: "",
				slug: ""
			};
		},
		computed: {
			rendered() {
				return this.render(this.text);
			}
		},
		methods: {
			render(text) {
				const {replaced, renderingTemplates} = this.replaceTemplates(text);
				const rendered = this.renderTemplates(replaced, renderingTemplates);
				const html = InstaView.convert(rendered);
				return html;
			},

			replaceTemplates(text) {
				let lastTemplateId = 0;

				const templateConstant = `MY_AWESOME_TEMPLATE_NUMBER_{{id}}_GOES_HERE_PLEASE_DONT_USE_THIS_CONSTANT_ANYWHERE_IN_ARTICLE`;

				const renderingTemplates = {};

				// First, replace {{templates}} with constants
				let replaced = text, oldReplaced;
				do {
					oldReplaced = replaced;
					replaced = replaced.replace(/{{(.*?)}}/g, (all, template) => {
						const id = lastTemplateId++;
						renderingTemplates[id] = template;
						return templateConstant.replace("{{id}}", id);
					});
				} while(oldReplaced != replaced);

				return {renderingTemplates, replaced};
			},
			renderTemplates(text, renderingTemplates) {
				const templateRegexp = /MY_AWESOME_TEMPLATE_NUMBER_(.+?)_GOES_HERE_PLEASE_DONT_USE_THIS_CONSTANT_ANYWHERE_IN_ARTICLE/g;

				const rendered = text.replace(templateRegexp, (all, id) => {
					const template = renderingTemplates[id];

					const {name, params} = this.parseTemplate(template);
					for(let paramName of Object.keys(params)) {
						let paramValue = params[paramName];
						paramValue = this.renderTemplates(paramValue, renderingTemplates);
						params[paramName] = paramValue;
					}

					return this.renderTemplate(name, params);
				});

				return rendered;
			},

			parseTemplate(template) {
				let match = template.match(/^([^#<>\[\]\|\{\}]+?)\|(.*)$/);
				if(match) {
					return {
						name: match[1],
						params: this.parseTemplateParams(match[2])
					};
				}

				match = template.match(/^([^#<>\[\]\|\{\}]+?)$/);
				if(match) {
					return {
						name: match[1],
						params: {}
					};
				}

				return "";
			},

			parseTemplateParams(params) {
				let index = 1;
				let res = {};

				params.split("|").forEach(param => {
					if(param.indexOf("=") == -1) {
						res[index++] = param;
					} else {
						let name = params.substr(0, param.indexOf("="));
						let value = params.substr(param.indexOf("=") + 1);
						res[name] = value;
					}
				});

				return res;
			},

			renderTemplate(template, params) {
				template = template[0].toLowerCase() + template.substr(1);
				if(!Templates[template]) {
					return "\n\nNo template {{" + template + "}}\n\n";
				}

				return Templates[template](params);
			},

			todo() {
				const unnamedParam = `([^\\{\\}=]+?)`;

				const paramName = `([^#<>\\[\\]\\|\\{\\}=]+)`;
				const paramValue = `([^\\{\\}]+?)`;
				const namedParam = `(?:${paramName})=(?:${paramValue})`;

				const param = `(?:${unnamedParam})|(?:${namedParam})`;
				const params = `(?:(?:${param})\\|)*(?:${param})`;

				const templateRegexp = `^(?:${templateName})(?:\\|(?:${params})|)$`;

				console.log("name|unnamed1".match(templateRegexp));
			}
		}
	};
</script>