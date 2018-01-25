<template>
	<div v-html="markdown"></div>
</template>

<script type="text/javascript">
	import marked from "marked";

	export default {
		name: "markdown-article",
		props: ["text"],
		data() {
			return {
				text: ""
			};
		},
		computed: {
			markdown() {
				return marked(this.text);
			}
		}
	};
</script>