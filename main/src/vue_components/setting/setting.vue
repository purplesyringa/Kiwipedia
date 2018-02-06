<template>
	<div>
		<checkbox
			v-if="type == 'checkbox'"

			class="checkbox"
			ref="input"
			type="checkbox"
			:disabled="disabled"
			:value="value"
			@input="update"
		/>

		<div class="name">{{name}}</div>
		<div class="description">{{description}}</div>

		<textarea
			v-if="type == 'multiline'"

			ref="input"
			:disabled="disabled"
			:value="value"
			@input="update"
		/>
		<div v-else-if="type == 'checkbox'" />
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
	import Checkbox from "./checkbox.vue";

	export default {
		name: "init-hub",
		props: ["name", "description", "type", "value", "disabled"],
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
		},

		components: {
			checkbox: Checkbox
		}
	};
</script>