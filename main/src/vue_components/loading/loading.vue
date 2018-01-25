<template>
	<vue-loading type="bars" color="#ee3" :size="{width: '50px', height: '50px'}" class="loading" />
</template>

<style lang="sass" scoped>
	.loading
		position: absolute
		left: 50%
		top: 50%
		transform: translateY(-50%) translateX(-50%)
</style>

<script type="text/javascript">
	import VueLoading from "vue-loading-template";

	export default {
		name: "loading",
		components: {
			"vue-loading": VueLoading
		}
	};
</script>