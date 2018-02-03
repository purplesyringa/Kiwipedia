export default {
	name: "external media",
	async render(params, renderer) {
		let images = [params.image1, params.image2, params.image3];
		images = images.filter(image => image);
		images = images.map(image => `<img src="${image}" />`);
		images = images.join("<br />");

		let audios = [params.audio1, params.audio2, params.audio3];
		audios = audios.filter(audio => audio);
		audios = audios.map(audio => `<audio src="${audio}" controls />`);
		audios = audios.join("<br />");

		let videos = [params.video1, params.video2, params.video3];
		videos = videos.filter(video => video);
		videos = videos.map(video => `<video src="${video}" controls />`);
		videos = videos.join("<br />");

		return [].concat(images, audios, videos).join("<br />");
	}
};