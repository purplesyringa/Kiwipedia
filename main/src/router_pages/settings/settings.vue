<template>
	<div>
		<h1>My settings</h1>

		<setting
			type="checkbox"
			name="Don't show &quot;Unknown template&quot; messages"
			description=""
			:disabled="!ready"
			v-model="hideUnknownTemplate"
		/>
	</div>
</template>

<script type="text/javascript">
	import * as Settings from "../../common/settings.js";

	export default {
		name: "settings",
		data() {
			return {
				ready: false,

				hideUnknownTemplate: false
			};
		},
		async mounted() {
			const settings = await Settings.load();
			this.hideUnknownTemplate = settings.hideUnknownTemplate;

			this.ready = true;
		},
		watch: {
			hideUnknownTemplate() {
				this.save();
			}
		},
		methods: {
			save() {
				Settings.save({
					hideUnknownTemplate: this.hideUnknownTemplate
				});
			}
		}
	};
</script>