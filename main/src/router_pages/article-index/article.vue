<template>
	<a class="article" :href="`?/wiki/${slug}/${article}`" @click.prevent="$router.navigate(`wiki/${slug}/${article}`)">
		<div class="title">{{title}}</div>
		<div class="editor">Last edited on {{formatDate(date)}}</div>
	</a>
</template>

<style lang="sass" src="./article.sass"></style>

<script type="text/javascript">
	export default {
		name: "article",
		props: ["slug", "article", "title", "date"],
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