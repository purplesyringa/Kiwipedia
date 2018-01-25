<template>
	<div>
		<div class="name">{{name}}</div>
		<div class="description">{{description}}</div>

		<textarea
			v-if="multiline"

			ref="input"
			:disabled="disabled"
			:value="value"
			@input="update"
		/>
		<input
			v-else

			ref="input"
			type="text"
			:disabled="disabled"
			:value="value"
			@input="update"
		/>
	</div>
</template>

<style lang="sass" src="./setting.sass" scoped></style>

<script type="text/javascript">
	export default {
		name: "init-hub",
		props: ["name", "description", "multiline", "value"],
		data() {
			return {
				value: "",
				disabled: false
			};
		},

		methods: {
			update() {
				this.$emit("input", this.$refs.input.value);
			}
		}
	};
</script>