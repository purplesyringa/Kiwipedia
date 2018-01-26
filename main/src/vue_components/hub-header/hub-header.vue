<template>
	<p class="origin">
		From <b>{{hub.language}}</b>
		<b v-if="hub.subgroup != ''"> | {{hub.subgroup}}</b>
	</p>
</template>

<style lang="sass" src="./hub-header.sass"></style>

<script type="text/javascript">
	export default {
		name: "hub-header",
		props: ["hub"]
	};
</script>