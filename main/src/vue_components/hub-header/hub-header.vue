<template>
	<div class="hub-header">
		You are viewing hub
		<b>{{hub.language}}</b>
		<b v-if="hub.subgroup != ''">
			<div class="bar" />
			{{hub.subgroup}}
		</b>

		<br>

		<a :href="`?/wiki/${hub.slug}/home`" @click.prevent="$router.navigate(`wiki/${hub.slug}/home`)">Home</a>
		<div class="bar" />
		<a :href="`?/new-article/${hub.slug}`" @click.prevent="$router.navigate(`new-article/${hub.slug}`)">Create a new article</a>
	</div>
</template>

<style lang="sass" src="./hub-header.sass" scoped></style>

<script type="text/javascript">
	export default {
		name: "hub-header",
		props: ["hub"]
	};
</script>