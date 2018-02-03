export default {
	name: "#if",
	async render(params, renderer) {
		return await renderer(
			"if",
			{
				1: "",
				2: params[1],
				3: params[2],
				4: params[3]
			}
		);
	}
};