<template>
	<div class="current-view">
		<component :is="$parent.currentView" ref="currentView"></component>
	</div>
</template>

<script language="text/javascript">
	export default {
		props: [],
		name: "root"
	};
</script>