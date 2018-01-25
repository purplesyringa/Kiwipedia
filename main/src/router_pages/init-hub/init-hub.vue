<template>
	<div>
		<h1>Init Hub</h1>
		<p>
			Choose settings for your new hub.
		</p>

		<setting
			name="Language"
			description="en/pl/etc."
			v-model="language"
		/>
		<setting
			name="Subgroup (optional)"
			description="ZeroNet development/America/etc."
			v-model="subgroup"
		/>

		<s-button @click="init" value="Init" />
	</div>
</template>

<style lang="sass" src="./init-hub.sass" scoped></style>

<script type="text/javascript">
	import init from "../../common/init-hub.js";

	export default {
		name: "init-hub",
		data() {
			return {
				language: null,
				subgroup: null
			};
		},
		methods: {
			async init() {
				const language = this.language.trim();
				const subgroup = this.subgroup.trim();
				const address = this.$router.currentParams.address;

				const slug = await init(language, subgroup, address);

				this.$router.navigate(`/wiki/${slug}/home`);
			}
		}
	};
</script>