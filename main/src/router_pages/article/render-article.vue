<template>
	<div v-html="rendered"></div>
</template>

<script type="text/javascript">
	import InstaView from "instaview";
	import Templates from "../../wiki-templates/templates.js";
	import {toSlug} from "../../common/hub.js";
	import {getHubList} from "../../common/hub-manager.js";

	export default {
		name: "markdown-article",
		props: ["text", "slug"],
		data() {
			return {
				text: "",
				slug: ""
			};
		},
		asyncComputed: {
			async rendered() {
				return await this.render(this.text);
			}
		},
		methods: {
			async render(text) {
				await this.init();

				const renderData = this.initTemplates();

				const {replaced, renderingTemplates} = this.replaceTemplates(text);
				const rendered = this.renderTemplates(replaced, renderingTemplates, renderData);
				let html = InstaView.convert(rendered);
				html = html.replace(/ARTICLENAMEGOESHERE(.*?)(['"])/g, (all, article, quote) => {
					if(article.indexOf(":") == -1) {
						// Local link
						return `?/wiki/${this.slug}/${toSlug(article)}${quote}`;
					} else {
						// Interwiki
						article = article.replace(/^:/, "");

						let wiki = article.substr(0, article.indexOf(":"));
						article = article.substr(article.indexOf(":") + 1);

						wiki = toSlug(wiki.replace("/", "MYAWESOMECONSTANT")).replace(toSlug("MYAWESOMECONSTANT"), "/");

						return `?/wiki/${wiki}/${toSlug(article)}${quote}`;
					}
				});

				return html;
			},

			async init() {
				let hubs = await getHubList();
				hubs = hubs.map(hub => hub.slug);
				hubs = hubs.join("|");

				InstaView.conf.wiki = {
					lang: "language",
					interwiki: hubs,
					default_thumb_width: 180
				};
				InstaView.conf.paths = {
					base_href: "./",
					articles: `ARTICLENAMEGOESHERE`,
					math: "/math/", // TODO
					images: "",
					images_fallback: "", // TODO
					magnify_icon: "" // TODO
				};
			},

			initTemplates() {
				let renderData = {};
				for(let template of Object.values(Templates)) {
					if(template.init) {
						template.init.call(renderData);
					}
				}
				return renderData;
			},

			replaceTemplates(text) {
				let lastTemplateId = 0;

				const templateConstant = `MY_AWESOME_TEMPLATE_NUMBER_{{id}}_GOES_HERE_PLEASE_DONT_USE_THIS_CONSTANT_ANYWHERE_IN_ARTICLE`;

				const renderingTemplates = {};

				// Remove <!-- --> comments
				text = text.replace(/<!--[\s\S]*?-->/g, "");

				// First, replace {{templates}} with constants
				let replaced = text, oldReplaced;
				do {
					oldReplaced = replaced;
					replaced = this.replace(replaced, template => {
						const id = lastTemplateId++;
						renderingTemplates[id] = template;
						return templateConstant.replace("{{id}}", id);
					});
				} while(oldReplaced != replaced);

				return {renderingTemplates, replaced};
			},
			replace(text, callback) {
				// First tokenize
				let tokens = [];
				let state = "";
				text.split("").forEach(char => {
					if(char == "{" && state == "{") {
						state = "";
						tokens.pop();
						tokens.push("\x00");
					} else if(char == "{" && state != "{") {
						state = "{";
						tokens.push(state);
					} else if(char == "}" && state == "}") {
						state = "";
						tokens.pop();
						tokens.push("\x01");
					} else if(char == "}" && state != "}") {
						state = "}";
						tokens.push(state);
					} else {
						tokens.push(char);
					}
				});

				tokens = tokens.join("");

				return tokens.replace(/\x00([^\x00\x01]*?)\x01/g, (all, template) => {
					return callback(template);
				}).replace(/\x00/g, "{{").replace(/\x01/g, "}}");
			},
			renderTemplates(text, renderingTemplates, renderData) {
				const templateRegexp = /MY_AWESOME_TEMPLATE_NUMBER_(.+?)_GOES_HERE_PLEASE_DONT_USE_THIS_CONSTANT_ANYWHERE_IN_ARTICLE/g;

				const rendered = text.replace(templateRegexp, (all, id) => {
					const template = renderingTemplates[id];

					let {name, params} = this.parseTemplate(template);

					name = name[0].toLowerCase() + name.substr(1);
					if(!Templates[name]) {
						return this.renderTemplate("unexisting-template", {
							name: name
						}, renderData);
					}

					for(let paramName of Object.keys(params)) {
						let paramValue = params[paramName];
						paramValue = this.renderTemplates(paramValue, renderingTemplates, renderData);
						params[paramName] = paramValue;
					}

					return this.renderTemplate(name, params, renderData);
				});

				return rendered;
			},

			parseTemplate(template) {
				let match = template.match(/^([^#<>\[\]\|\{\}]+?)\|([\s\S]*)$/);
				if(match) {
					return {
						name: match[1].trim(),
						params: this.parseTemplateParams(match[2])
					};
				}

				match = template.match(/^([^#<>\[\]\|\{\}]+?)$/);
				if(match) {
					return {
						name: match[1].trim(),
						params: {}
					};
				}

				return "";
			},

			parseTemplateParams(params) {
				let index = 1;
				let res = {};

				params.split("|").forEach(param => {
					param = param.trim();
					if(param.indexOf("=") == -1) {
						res[index++] = param;
					} else {
						let name = param.substr(0, param.indexOf("="));
						let value = param.substr(param.indexOf("=") + 1);
						res[name] = value;
					}
				});

				return res;
			},

			renderTemplate(template, params, renderData) {
				const renderer = (template, params) => {
					return this.renderTemplate(template, params, renderData);
				};

				template = template[0].toLowerCase() + template.substr(1);
				if(!Templates[template]) {
					return Templates["unexisting-template"].render.call(renderData, {
						name: template
					}, renderer);
				}

				return Templates[template].render.call(renderData, params, renderer);
			},

			todo() {
				const unnamedParam = `([^\\{\\}=]+?)`;

				const paramName = `([^#<>\\[\\]\\|\\{\\}=]+)`;
				const paramValue = `([^\\{\\}]+?)`;
				const namedParam = `(?:${paramName})=(?:${paramValue})`;

				const param = `(?:${unnamedParam})|(?:${namedParam})`;
				const params = `(?:(?:${param})\\|)*(?:${param})`;

				const templateRegexp = `^(?:${templateName})(?:\\|(?:${params})|)$`;
			}
		}
	};
</script>