<template>
	<div>
		<h1>Init Hub</h1>
		<p>
			Choose settings for your new hub.
		</p>

		<setting
			name="Language"
			description="English/Polish/etc."
			ref="language"
		/>
		<setting
			name="Subgroup (optional)"
			description="ZeroNet development/America/etc."
			ref="subgroup"
		/>

		<button @click="init">Init</button>
	</div>
</template>

<style lang="sass" src="./init-hub.sass" scoped></style>

<script type="text/javascript">
	export default {
		name: "init-hub",
		data() {
			return {
				language: null
			};
		},
		methods: {
			init() {
				const language = this.$refs.language.value.trim();
				const subgroup = this.$refs.subgroup.value.trim();
				const address = this.$router.currentParams.address;
				console.log(address);
			}
		}
	};
</script>