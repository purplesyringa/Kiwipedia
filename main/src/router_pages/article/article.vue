<template>
	<div>
		<h1>{{header}}</h1>
		<p>{{content}}</p>
	</div>
</template>

<script type="text/javascript">
	import Hub from "../../common/hub.js";

	export default {
		name: "article",
		data() {
			return {
				header: "",
				content: "",

				hub: null
			};
		},
		async mounted() {
			const language = this.$router.currentParams.language;
			const subgroup = this.$router.currentParams.subgroup || "";
			const slug = language + (subgroup && `/${subgroup}`);

			const article = this.$router.currentParams.article;

			this.hub = new Hub(slug);
			try {
				await this.hub.init();
			} catch(e) {
				this.header = "Error";
				this.content = e.stack;
				return;
			}

			console.log(this.hub);
		}
	};
</script>