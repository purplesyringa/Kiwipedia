<template>
	<p>{{text}}</p>
</template>

<script type="text/javascript">
	export default {
		name: "markdown-article",
		props: ["text"],
		data() {
			return {
				text: ""
			};
		}
	};
</script>