<template>
	<div>
		<h1>New Hub</h1>
		<p>
			Kiwipedia is creating your hub.
		</p>
	</div>
</template>

<script type="text/javascript">
	import * as config from "../config.js";
	import {loadAdditional} from "../common/startup.js";

	export default {
		name: "new-hub",
		async mounted() {
			await loadAdditional();
			this.$zeroPage.cmd("siteClone", [config.templateAddress]);
		}
	};
</script>