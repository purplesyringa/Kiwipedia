<template>
	<div class="hub-header">
		<b>{{hub.language}}</b>
		<b v-if="hub.subgroup != ''">
			<div class="bar" />
			{{hub.subgroup}}
		</b>
	</div>
</template>

<style lang="sass" src="./hub-header.sass" scoped></style>

<script type="text/javascript">
	export default {
		name: "hub-header",
		props: ["hub"]
	};
</script>