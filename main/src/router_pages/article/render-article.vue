<template>
	<div v-if="rendered != ''" class="rendered" v-html="rendered" @click="clicked" :id="id" />
	<loading v-else />
</template>

<style lang="sass" scoped>
.rendered
	font-family: "Verdana", "Arial", sans-serif
	font-size: 16px
</style>

<script type="text/javascript">
	import InstaView from "instaview";
	import Templates from "../../wiki-templates/templates.js";
	import Hub, {toSlug} from "../../common/hub.js";
	import {getHubList} from "../../common/hub-manager.js";
	import htmlparser from "htmlparser";
	import stringReplaceAsync from "string-replace-async";

	export default {
		name: "markdown-article",
		props: ["text", "slug", "article", "imported"],
		data() {
			return {
				text: "",
				slug: "",
				article: "",
				imported: "",
				rendered: "",

				id: ""
			};
		},
		async mounted() {
			this.id = Math.random().toString(36).substr(2);
			this.rendered = await this.render(this.text);
		},
		methods: {
			async render(text) {
				await this.init();

				const renderData = this.initTemplates();

				const {replaced, renderingTemplates} = this.replaceTemplates(text);
				const rendered = await this.renderTemplates(replaced, renderingTemplates, renderData);

				const html = await this.wikiTextToHTML(rendered);
				return html;
			},

			async wikiTextToHTML(wikitext) {
				let html = InstaView.convert(wikitext);

				html = await stringReplaceAsync(html, /ARTICLENAMEGOESHERE(.*?)(['"])/g, async (all, article, quote) => {
					let wiki;

					if(article.indexOf(":") == -1) {
						// Local link
						wiki = this.slug;
					} else {
						// Interwiki
						article = article.replace(/^:/, "");

						wiki = article.substr(0, article.indexOf(":"));
						article = article.substr(article.indexOf(":") + 1);

						wiki = toSlug(wiki.replace("/", "MYAWESOMECONSTANT")).replace(toSlug("MYAWESOMECONSTANT"), "/");
					}

					article = toSlug(article);

					const hub = new Hub(wiki);
					try {
						await hub.init();
					} catch(e) {
						return `?/wiki/${wiki}/${article}${quote} class='interwiki-invalid'`;
					}

					try {
						await hub.getArticleOrigins(article);
					} catch(e) {
						return `?/wiki/${wiki}/${article}${quote} class='interwiki-error'`;
					}

					return `?/wiki/${wiki}/${article}${quote} class='interwiki-exists'`;
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
						state = "";
						tokens.push(char);
					}
				});

				tokens = tokens.join("");

				return tokens.replace(/\x00([^\x00\x01]*?)\x01/g, (all, template) => {
					return callback(template);
				}).replace(/\x00/g, "{{").replace(/\x01/g, "}}");
			},

			async renderTemplates(text, renderingTemplates, renderData) {
				let rendered = this.renderCurlyTemplates(text, renderingTemplates, renderData);
				rendered = await this.convertTagTemplates(rendered, renderData);
				return rendered;
			},
			renderCurlyTemplates(text, renderingTemplates, renderData) {
				const templateRegexp = /MY_AWESOME_TEMPLATE_NUMBER_(.+?)_GOES_HERE_PLEASE_DONT_USE_THIS_CONSTANT_ANYWHERE_IN_ARTICLE/g;

				const rendered = text.replace(templateRegexp, (all, id) => {
					const template = renderingTemplates[id];

					let {name, params} = this.parseTemplate(template);

					name = name[0].toLowerCase() + name.substr(1);
					if(!Templates[name]) {
						return `
							<kiwipedia-template is="unexisting-template">
								<kiwipedia-param name="name">${name}</kiwipedia-param>
							</kiwipedia-template>
						`;
					}

					for(let paramName of Object.keys(params)) {
						let paramValue = params[paramName];
						paramValue = this.renderCurlyTemplates(paramValue, renderingTemplates, renderData);
						params[paramName] = paramValue;
					}

					return (
						`<kiwipedia-template is="${name}">` +
							Object.keys(params).map(paramName => {
								let paramValue = params[paramName];
								paramValue = this.renderCurlyTemplates(paramValue, renderingTemplates, renderData);

								return `<kiwipedia-param name="${paramName}">${paramValue}</kiwipedia-param>`;
							}).join("") +
						`</kiwipedia-template>`
					);
				});

				return rendered;
			},

			parseTemplate(template) {
				if(template[0] == "#") {
					let name = template.substr(0, template.indexOf(":"));
					let params = template.substr(template.indexOf(":") + 1);

					return {
						name: name.trimLeft(),
						params: this.parseTemplateParams(params, false)
					};
				}

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

				return {
					name: "invalid-template",
					params: {
						code: template
					}
				};
			},

			parseTemplateParams(params, trim=true) {
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
			},

			async renderTemplate(template, params, renderData) {
				const renderer = async (template, params) => {
					return await this.renderTemplate(template, params, renderData);
				};

				template = template[0].toLowerCase() + template.substr(1);
				if(!Templates[template]) {
					return await this.renderTemplate("unexisting-template", {
						name: template
					}, renderData);
				}

				const context = {
					slug: this.slug,
					article: this.article,
					imported: this.imported
				};

				return (await Templates[template].render.call(renderData, params, renderer, context))
					.replace(/\n/g, "");
			},

			async convertTagTemplates(html, renderData) {
				const handler = new htmlparser.DefaultHandler((error, dom) => {});
				const parser = new htmlparser.Parser(handler);
				parser.parseComplete(`<div>\n${html}\n</div>`);

				const renderTagTemplate = async elem => {
					const template = elem.attribs.is;

					const params = {};
					const children = (elem.children || [])
						.filter(child => child.type == "tag" && child.name == "kiwipedia-param");

					for(const child of children) {
						const paramName = child.attribs.name;
						const paramValue = (await Promise.all((child.children || []).map(convert))).join("");

						params[paramName] = paramValue;
					}

					return await this.renderTemplate(template, params, renderData);
				};

				const convert = async elem => {
					if(elem.type == "text") {
						return elem.data;
					} else if(elem.type == "tag") {
						if(elem.name == "kiwipedia-template") {
							return await renderTagTemplate(elem);
						}

						let renderedInside = (await Promise.all((elem.children || []).map(convert))).join("");

						let template = `<${elem.name}>`;
						if(Templates[template]) {
							let params = {_: renderedInside};
							Object.assign(params, elem.attribs || {});
							return await this.renderTemplate(template, params, renderData);
						} else {
							return `<${elem.data}>${renderedInside}</${elem.name}>`;
						}
					}
				};
				return await convert(handler.dom[0]);
			},

			clicked(e) {
				let parent = e.target;
				while(parent) {
					if(typeof parent.tagName == "string" && parent.tagName.toLowerCase() == "a") {
						const href = parent.getAttribute("href") || "";
						if(href[0] == "?") {
							this.$router.navigate(href.replace(/^\?\/?/, ""));
						}
						e.preventDefault();
						break;
					}
					parent = parent.parentNode;
				}
			}
		}
	};
</script>