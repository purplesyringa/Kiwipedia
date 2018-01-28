<template>
	<div>
		<h1>New Hub</h1>
		<p>
			<!-- Kiwipedia is creating your hub. -->
			Before Kiwipedia is released from beta, creating hub is limited to developers. If you want to add a hub, use <a href="/Me.ZeroNetwork.bit/?Profile/1SunAWK2VUT9GQK32MpwRfFPVgcBSJN9a/1Cy3ntkN2GN9MH6EaW6eHpi4YoRS2nK5Di/gitcenter@zeroid.bit">ZeroMe</a>.
		</p>
	</div>
</template>

<script type="text/javascript">
	import * as config from "../config.js";
	import {loadAdditional} from "../common/startup.js";

	export default {
		name: "new-hub",
		async mounted() {
			/*
			await loadAdditional();
			this.$zeroPage.cmd("siteClone", [config.templateAddress]);
			*/
		}
	};
</script>