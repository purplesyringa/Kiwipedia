<template>
	<div>
		<div class="name">{{name}}</div>
		<div class="description">{{description}}</div>

		<div v-if="multiline">
			<textarea v-model="value" :disabled="disabled"></textarea>
		</div>
		<div v-else>
			<input type="text" v-model="value" :disabled="disabled">
		</div>
	</div>
</template>

<style lang="sass" src="./setting.sass" scoped></style>

<script type="text/javascript">
	export default {
		name: "init-hub",
		props: ["name", "description", "multiline"],
		data() {
			return {
				value: "",
				disabled: false
			};
		}
	};
</script>