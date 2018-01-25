<template>
	<div v-html="rendered"></div>
</template>

<script type="text/javascript">
	import InstaView from "instaview";

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
				return InstaView.convert(this.text);
			}
		}
	};
</script>