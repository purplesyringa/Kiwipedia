export default {
	name: "hatnote",
	async render(params, renderer) {
		const isTrue = val => ["yes", "y", "true", "1"].indexOf(val) > -1;

		return `
			<div role="note" class="hatnote ${params.extraclasses || ""} ${isTrue(params.selfref) ? "selfref" : ""}">
				${params[1]}
			</div>
		`;
	}
};