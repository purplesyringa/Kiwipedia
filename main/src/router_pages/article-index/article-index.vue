<template>
	<div>
		<div v-if="status == 'error'">
			<h1>Error</h1>
			<p>{{error}}</p>
		</div>
		<div v-else-if="status == 'ready'">
			<hub-header :hub="hub" />

			<h1>Article index</h1>

			<article-item
				v-for="article in articles"
				:key="article.slug"

				:slug="slug"
				:article="article.slug"
				:title="article.title"
				:date="article.date_updated"
			/>
		</div>
		<loading v-else />
	</div>
</template>

<style lang="sass" src="./article-index.sass"></style>

<script type="text/javascript">
	import Hub, {NotEnoughError, TooMuchError} from "../../common/hub.js";
	import Article from "./article.vue";

	export default {
		name: "article-index",
		data() {
			return {
				slug: "",
				status: "",
				error: "",

				hub: null,

				article: "",
				articleNode: null
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

			this.status = "ready";
		},
		asyncComputed: {
			async articles() {
				if(this.status == "") {
					await this.hub.init();
				}

				return await this.hub.getIndex();
			}
		},
		components: {
			"article-item": Article
		}
	};
</script>