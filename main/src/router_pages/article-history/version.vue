<template>
	<a class="version" :href="`?/version/${slug}/${date}`" @click.prevent="$router.navigate(`version/${slug}/${date}`)">
		<div class="title">{{formatDate(date)}}</div>
		<div class="editor">Editor: {{editor}}</div>
	</a>
</template>

<style lang="sass" src="./version.sass"></style>

<script type="text/javascript">
	export default {
		name: "version",
		props: ["slug", "date", "editor"],
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