<template>
	<div>
		<button class="s-button" @click="$emit('click')">{{value}}</button>
	</div>
</template>

<style lang="sass" src="./s-button.sass" scoped></style>

<script type="text/javascript">
	export default {
		name: "s-button",
		props: ["value"],

		data() {
			return {
				value: ""
			};
		}
	};
</script>