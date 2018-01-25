<template>
	<div>
		<h1>Hub list</h1>

		<hub
			v-for="hub in hubs"
			key="hub.address"

			:slug="hub.slug"
			:language="hub.language"
			:subgroup="hub.subgroup"
			:runner="hub.runner"
		/>
	</div>
</template>

<style lang="sass" src="./hub-list.sass"></style>

<script type="text/javascript">
	import Hub from "./hub.vue";
	import {getHubList} from "../../common/hub-manager.js";

	export default {
		name: "hub-list",
		data() {
			return {};
		},
		components: {
			hub: Hub
		},
		asyncComputed: {
			async hubs() {
				return await getHubList();
			}
		}
	};
</script>