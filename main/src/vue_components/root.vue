<template>
	<div>
		<sidebar />

		<div class="current-view">
			<component :is="$parent.currentView" ref="currentView"></component>
		</div>
	</div>
</template>

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