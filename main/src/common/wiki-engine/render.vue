<template>
	<div v-if="rendered != ''" class="rendered" v-html="rendered" @click="clicked" :id="id" />
	<loading v-else />
</template>

<style lang="sass" scoped>
.rendered
	font-family: "Verdana", "Arial", sans-serif
	font-size: 16px
</style>

<script type="text/javascript">
	import Render from "./render.js";
	export default Render;
</script>