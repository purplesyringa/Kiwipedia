<template>
	<div>
		<div v-if="status == 'no-article'">
			<h1>No article named <i>{{article}}</i></h1>
			<p>
				<a :href="'?/new-article/' + slug" @click.prevent="$router.navigate('new-article/' + slug)">Want to create one?</a>
			</p>
		</div>
		<div v-else-if="status == 'no-version'">
			<h1>No version <i>{{version}}</i> of article <i>{{article}}</i></h1>
			<p>
				<a :href="`?/edit-article/${slug}/${article}`" @click.prevent="$router.navigate(`edit-article/${slug}/${article}`)">Want to update this article</a> or <a :href="`?/wiki/${slug}/${article}`" @click.prevent="$router.navigate(`wiki/${slug}/${article}`)">look at to latest version</a>?
			</p>
		</div>
		<div v-else-if="status == 'error'">
			<h1>Error</h1>
			<p>{{error}}</p>
		</div>
		<div v-else-if="articleNode">
			<hub-header :hub="hub" />

			<h1>
				{{articleNode.title}}
				<a class="history-icon" :href="`?/article-history/${slug}/${article}`" @click.prevent="$router.navigate(`article-history/${slug}/${article}`)">&#9776;</a>
			</h1>

			<blockquote>
				You are viewing an outdated version. For latest version, <a :href="`?wiki/${slug}/${article}`" @click.prevent="$router.navigate(`wiki/${slug}/${article}`)">look here</a>.
			</blockquote>

			<render-article :text="articleNode.text" :slug="slug" />
		</div>
		<loading v-else />
	</div>
</template>

<style lang="sass" src="./article-version.sass"></style>

<script type="text/javascript">
	import Hub, {NotEnoughError, TooMuchError} from "../../common/hub.js";
	import RenderArticle from "../article/render-article.vue";

	export default {
		name: "article-version",
		data() {
			return {
				error: "",
				status: "",
				slug: "",
				article: "",

				hub: null,
				articleNode: null
			};
		},
		async mounted() {
			const language = this.$router.currentParams.language;
			const subgroup = this.$router.currentParams.subgroup || "";
			this.slug = language + (subgroup && `/${subgroup}`);

			this.article = this.$router.currentParams.article;
			this.version = this.$router.currentParams.date;

			this.hub = new Hub(this.slug);
			try {
				await this.hub.init();
			} catch(e) {
				this.error = e.message;
				this.status = "error";
				return;
			}

			try {
				await this.hub.getArticle(this.article);
			} catch(e) {
				if(e instanceof NotEnoughError) {
					this.status = "no-article";
				} else {
					this.error = e.message;
					this.status = "error";
				}
				return;
			}

			try {
				this.articleNode = await this.hub.getArticleVersion(this.article, this.version);
			} catch(e) {
				if(e instanceof NotEnoughError) {
					this.status = "no-version";
				} else {
					this.error = e.message;
					this.status = "error";
				}
				return;
			}
		},
		components: {
			"render-article": RenderArticle
		}
	};
</script>