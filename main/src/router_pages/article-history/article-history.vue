<template>
	<div>
		<div v-if="status == 'error'">
			<h1>Error</h1>
			<p>{{error}}</p>
		</div>
		<div v-else-if="articleNode">
			<h1>
				{{articleNode.title}}
				<a class="view-icon" :href="`?/wiki/${slug}/${article}`" @click.prevent="$router.navigate(`wiki/${slug}/${article}`)">&#128065;</a>
			</h1>
			<p class="origin">
				From <b>{{hub.language}}</b>
				<b v-if="hub.subgroup != ''"> | {{hub.subgroup}}</b>
			</p>

			<version
				v-for="version in versions"
				:key="version.date_updated"

				:date="version.date_updated"
				:editor="version.cert_user_id"
			/>
		</div>
		<loading v-else />
	</div>
</template>

<style lang="sass" src="./article-history.sass"></style>

<script type="text/javascript">
	import Hub, {NotEnoughError, TooMuchError} from "../../common/hub.js";
	import Version from "./version.vue";

	export default {
		name: "article-history",
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

			this.article = this.$router.currentParams.article;
			this.articleNode = await this.hub.getArticle(this.article);
		},
		asyncComputed: {
			async versions() {
				return this.hub.getArticleHistory(this.article);
			}
		},
		components: {
			version: Version
		}
	};
</script>