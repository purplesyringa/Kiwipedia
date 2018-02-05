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
	export * from "./render.js";
</script>