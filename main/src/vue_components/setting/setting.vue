<template>
	<div>
		<div class="name">{{name}}</div>
		<div class="description">{{description}}</div>
		<input type="text" v-model="value">
	</div>
</template>

<style lang="sass" src="./setting.sass" scoped></style>

<script type="text/javascript">
	export default {
		name: "init-hub",
		props: ["name", "description"],
		data() {
			return {
				value: ""
			};
		}
	};
</script>