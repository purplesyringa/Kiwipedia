import InstaView from "instaview";
import Templates from "../../wiki-templates/templates.js";
import htmlparser from "./htmlparser.js";
import HTMLHandler from "./htmlhandler.js";
import * as util from "../../common/util.js";
import * as wikiText from "./wikitext.js";
import {replaceTemplates, renderCurlyTemplates} from "./template.js";

export default {
	name: "markdown-article",
	props: ["text", "slug", "article", "imported", "title"],
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

		const res = await this.render(this.text);
		this.rendered = res.html;

		let renderData = res.renderData;
		Object.freeze(renderData);

		this.$nextTick(() => {
			const rootNode = document.getElementById(this.id);
			if(!rootNode) {
				return;
			}

			const secondaryRenderer = async (template, params) => {
				if(Templates[template].afterRender) {
					return await this.renderTemplate(
						"ambox",
						{
							type: "serious",
							text: "'''AfterRender error'''",
							"text-small": "Template with afterRender cannot be invoked in afterRender handler"
						}
					);
				}

				return await this.renderTemplate(template, params, renderData);
			};

			Object.keys(Templates)
				.filter(templateName => /^<.*>$/.test(templateName))
				.map(templateName => templateName.match(/^<(.*)>$/)[1])
				.filter(tagName => Templates[`<${tagName}>`].afterRender)
				.forEach(tagName => {
					const toRender = Array.from(rootNode.querySelectorAll(`rendered-${tagName}`));
					toRender.forEach(async node => {
						let params = {_: util.base64decode(node.innerHTML)};

						Array.from(node.attributes)
							.forEach(attr => params[attr.name] = attr.value);

						const afterRender = await Templates[`<${tagName}>`].afterRender(params, secondaryRenderer);

						const newNode = document.createElement("div");
						newNode.innerHTML = afterRender;

						if(newNode.children.length == 0) {
							node.parentNode.removeChild(node);
						} else if(newNode.children.length == 1) {
							node.parentNode.replaceChild(newNode.children[0], node);
						} else {
							node.innerHTML = await wikiText.wikiTextToHTML(
								await this.renderTemplate(
									"ambox",
									{
										type: "serious",
										text: "'''AfterRender error'''",
										"text-small": `AfterRender handler must return one node only, ${newNode.children.length} were returned.`
									}
								),
								this.slug
							);
						}
					});
				});
		});
	},
	methods: {
		async render(text) {
			await wikiText.init();

			const renderData = this.initTemplates();

			text = this.prepareNowiki(text);

			const {replaced, renderingTemplates} = replaceTemplates(text);
			const rendered = await this.renderTemplates(replaced, renderingTemplates, renderData);

			const html = await wikiText.wikiTextToHTML(rendered, this.slug);
			return {html, renderData};
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

		async renderTemplates(text, renderingTemplates, renderData) {
			let rendered = renderCurlyTemplates(text, renderingTemplates, renderData);
			rendered = await this.convertTagTemplates(rendered, renderData);
			return rendered;
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
				imported: this.imported,
				title: this.title
			};

			let rendered = (await Templates[template].render.call(renderData, params, renderer, context))
				.trim()
				.replace(/\n/g, "");

			if(/^<.*>$/.test(template) && Templates[template].afterRender) {
				let attribs = (
					Object.keys(params)
						.filter(name => name != "_")
						.map(name => {
							return {
								name: name,
								value: params[name]
									.replace(/&/g, "&amp;")
									.replace(/"/g, "&quot;")
							};
						})
						.map(({name, value}) => `${name}="${value}"`)
						.join(" ")
				)

				const tagName = template.match(/^<(.*)>$/)[1];
				rendered = `<rendered-${tagName} ${attribs}>${util.base64encode(rendered)}</rendered-${tagName}>`;
			}

			return rendered;
		},

		async convertTagTemplates(html, renderData) {
			const handler = new HTMLHandler(`<div>\n${html}\n</div>`);
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

			const renderNowiki = async elem => {
				const params = {};
				const children = (elem.children || [])
					.filter(child => child.type == "tag" && child.name == "kiwipedia-param");

				for(const child of children) {
					const paramName = child.attribs.name;
					const paramValue = (await Promise.all((child.children || []).map(convert))).join("");

					params[paramName] = paramValue;
				}

				let inside = (elem.children || [])
					.find(child => child.type == "tag" && child.name == "kiwipedia-inside");
				if(inside) {
					inside = util.base64decode(inside.attribs.value);
				} else {
					inside = "";
				}

				params._ = inside;

				const template = `<${elem.attribs.is}>`;

				return await this.renderTemplate(template, params, renderData);
			};

			const convert = async elem => {
				if(elem.type == "text") {
					return elem.raw;
				} else if(elem.type == "tag") {
					if(elem.name == "kiwipedia-template") {
						return await renderTagTemplate(elem);
					} else if(elem.name == "kiwipedia-nowiki") {
						return await renderNowiki(elem);
					}

					let renderedInside = (await Promise.all((elem.children || []).map(convert))).join("");

					let template = `<${elem.name}>`;
					if(Templates[template]) {
						let params = {_: renderedInside};
						Object.assign(params, elem.attribs || {});
						return await this.renderTemplate(template, params, renderData);
					} else {
						return `<${elem.raw}>${renderedInside}</${elem.name}>`;
					}
				}
			};
			return await convert(handler.dom[0]);
		},

		prepareNowiki(html) {
			const handler = new HTMLHandler(`<div>\n${html}\n</div>`);
			const parser = new htmlparser.Parser(handler);
			parser.parseComplete(`<div>\n${html}\n</div>`);

			const convertNowiki = elem => {
				if(elem.type == "text") {
					return elem.raw;
				} else if(elem.type == "tag") {
					let renderedInside = (elem.children || []).map(convertNowiki).join("");

					return `<${elem.raw}>${renderedInside}</${elem.name}>`;
				}
			};

			const getInside = elem => {
				const first = handler.tokens[elem.openTokenId];
				const last = handler.tokens[elem.closeTokenId];

				return `<div>\n${html}\n</div>`.substring(first.to + 1, last.from - 1);
			};

			const convert = elem => {
				if(elem.type == "text") {
					return elem.raw;
				} else if(elem.type == "tag") {
					if(Templates[`<${elem.name}>`] && Templates[`<${elem.name}>`].nowiki) {
						const renderedInside = getInside(elem);

						return `<kiwipedia-nowiki is="${elem.name}">` +
							Object.keys(elem.attribs || {}).map(key => {
								const value = elem.attribs[key];
								return `<kiwipedia-param name="${key}">${value}</kiwipedia-param>`;
							}).join("") +
							`<kiwipedia-inside value="${util.base64encode(renderedInside)}" />` +
						`</kiwipedia-nowiki>`;
					}

					let renderedInside = (elem.children || []).map(convert).join("");

					return `<${elem.raw}>${renderedInside}</${elem.name}>`;
				}
			};
			return convert(handler.dom[0]);
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