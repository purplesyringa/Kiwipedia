<template>
	<div>
		<div v-if="status == 'error'">
			<h1>Error</h1>
			<p>{{error}}</p>
		</div>
		<div v-else>
			<h1>Create a new article</h1>

			<setting
				name="Title"
				description=""
				ref="title"
			/>

			<setting
				name="Content"
				description="Markdown supported"
				ref="content"
				:multiline="true"
			/>
		</div>
	</div>
</template>

<script type="text/javascript">
	import Hub, {NotEnoughError, TooMuchError} from "../../common/hub.js";

	export default {
		name: "new-article",
		data() {
			return {
				slug: "",
				status: "",
				error: "",

				hub: null
			};
		},
		async mounted() {
			const language = this.$router.currentParams.language;
			const subgroup = this.$router.currentParams.subgroup || "";
			this.slug = language + (subgroup && `/${subgroup}`);

			this.hub = new Hub(this.slug);
			try {
				await this.hub.init();
			} catch(e) {
				this.header = "Error";
				this.error = e.message;
				this.status = "error";
				return;
			}
		}
	};
</script>