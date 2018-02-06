<template>
	<div :class="'checkbox' + (this.disabled ? ' disabled' : '')" @click="click">
		<span v-if="value">&#x2714;</span>
	</div>
</template>

<style lang="sass" src="./checkbox.sass" scoped></style>

<script type="text/javascript">
	export default {
		name: "checkbox",
		props: ["disabled", "value"],
		data() {
			return {
				value: false,
				disabled: false
			};
		},

		methods: {
			click() {
				if(this.disabled) {
					return;
				}

				this.value = !this.value;
				this.$emit("input", this.value);
			}
		}
	};
</script>