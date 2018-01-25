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

			<setting
				name="Content"
				description="Markdown supported"
				ref="content"
				:multiline="true"
				v-model="content"
			/>

			<s-button value="Publish" @click="publish" />
		</div>
		<loading v-else />
	</div>
</template>

<style lang="sass" src="./edit-article.sass"></style>

<script type="text/javascript">
	import Hub, {NotEnoughError, TooMuchError} from "../../common/hub.js";

	export default {
		name: "edit-article",
		data() {
			return {
				slug: "",
				status: "",
				error: "",

				title: "",
				content: "",

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

			this.content = this.articleNode.text;
		},
		methods: {
			async publish() {
				const slug = await this.hub.publishArticle(this.articleNode.title, this.content);

				this.$router.navigate(`wiki/${this.slug}/${slug}`);
			}
		}
	};
</script>