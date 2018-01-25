<template>
	<a class="version" :href="`?/article-version/${slug}/${article}/${date}`" @click.prevent="$router.navigate(`article-version/${slug}/${article}/${date}`)">
		<div class="title">{{formatDate(date)}}</div>
		<div class="editor">Editor: {{editor}}</div>
	</a>
</template>

<style lang="sass" src="./version.sass"></style>

<script type="text/javascript">
	export default {
		name: "version",
		props: ["slug", "article", "date", "editor"],
		data() {
			return {};
		},
		methods: {
			formatDate(date) {
				const dt = new Date(date);
				return dt.toLocaleString("en-US", {
					hour12: false,
					timeZone: "UTC",
					weekday: "long",
					year: "numeric",
					month: "long",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit",
					second: "2-digit",
					timeZoneName: "short"
				});
			}
		}
	};
</script>