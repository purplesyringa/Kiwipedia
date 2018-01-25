<template>
	<a class="hub" :href="`?/wiki/${slug}/home`" @click.prevent="$router.navigate(`wiki/${slug}/home`)">
		<div class="title">
			{{language}}

			<template v-if="subgroup != ''">
				| {{subgroup}}
			</template>
		</div>
		<div class="runner">Runner: {{runner}}</div>
	</a>
</template>

<style lang="sass" src="./hub.sass"></style>

<script type="text/javascript">
	export default {
		name: "hub",
		props: ["slug", "language", "subgroup", "runner"],
		data() {
			return {};
		}
	};
</script>