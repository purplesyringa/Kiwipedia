import Templates from "../../wiki-templates/templates.js";
import * as util from "../../common/util.js";
import * as wikiText from "./wikitext.js";
import {settings as templateSettings, replaceTemplates, renderCurlyTemplates, convertTagTemplates} from "./template.js";
import renderTemplateInit from "./render-template.js";
import * as nowiki from "./plugins/nowiki.js";
let renderTemplate;

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
					return await renderTemplate(
						"ambox",
						{
							type: "serious",
							text: "'''AfterRender error'''",
							"text-small": "Template with afterRender cannot be invoked in afterRender handler"
						}
					);
				}

				return await renderTemplate(template, params, renderData);
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
								await renderTemplate(
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
			renderTemplate = renderTemplateInit({
				slug: this.slug,
				article: this.article,
				imported: this.imported,
				title: this.title
			});
			templateSettings.renderTemplate = renderTemplate;

			const renderData = this.initTemplates();

			text = nowiki.prepareNowiki(text);

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
			rendered = await convertTagTemplates(rendered, renderData);
			return rendered;
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