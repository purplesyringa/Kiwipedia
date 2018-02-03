export default {
	nowiki: true,
	name: "<nowiki>",
	async render(params, renderer) {
		return params._;
	}
};