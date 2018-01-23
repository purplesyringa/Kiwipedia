<template>
	<div class="root">
		<sidebar />

		<div class="current-view">
			<component :is="$parent.currentView" ref="currentView"></component>
		</div>
	</div>
</template>

<style lang="sass" scoped>
	.root
		height: 100%
</style>

<script language="text/javascript">
	import Sidebar from "./sidebar/sidebar.vue";

	export default {
		props: [],
		name: "root",
		components: {
			sidebar: Sidebar
		}
	};
</script>