<template>
	<div>
		<div v-if="status == 'no-article'">
			<h1>No article named <i>{{article}}</i></h1>
			<p>
				<a :href="'?/new-article/' + slug" @click.prevent="$router.navigate('new-article/' + slug)">Want to create one?</a>
			</p>
		</div>
		<div v-else-if="status == 'error'">
			<h1>Error</h1>
			<p>{{error}}</p>
		</div>
		<div v-else-if="imported == 'ask'">
			<hub-header :hub="hub" />

			<h1>Imported</h1>
			<p>
				This is an imported article, and there are several versions you may want to look at. Choose between
				<span v-for="origin in origins">
					<a :href="`?/imported/${slug}/${toSlug(origin)}/${article}`" @click.prevent="$router.navigate(`imported/${slug}/${toSlug(origin)}/${article}`)">{{origin}}</a>
					<span> </span>
				</span> origins.
			</p>
		</div>
		<div v-else-if="articleNode">
			<hub-header :hub="hub" />

			<h1>
				{{articleNode.title}}
				<a class="edit-icon" :href="`?/edit-article/${slug}/${article}`" @click.prevent="$router.navigate(`edit-article/${slug}/${article}`)">&#9998;</a>
				<a class="history-icon" :href="`?/article-history/${slug}/${article}`" @click.prevent="$router.navigate(`article-history/${slug}/${article}`)">&#9776;</a>
			</h1>

			<div class="ambox ambox-notice" v-if="origins.length > 0">
				<b>This article has imported version(s) you may want to look at.</b><br>
				Choose between
				<span v-for="origin in origins">
					<a :href="`?/imported/${slug}/${toSlug(origin)}/${article}`" @click.prevent="$router.navigate(`imported/${slug}/${toSlug(origin)}/${article}`)">{{origin}}</a>
					<span> </span>
				</span>.
			</div>

			<render-article :text="articleNode.text" :slug="slug" />
		</div>
		<loading v-else />
	</div>
</template>

<style lang="sass" src="./article.sass"></style>

<script type="text/javascript">
	import Hub, {toSlug, NotEnoughError, TooMuchError} from "../../common/hub.js";
	import RenderArticle from "./render-article.vue";

	export default {
		name: "article",
		data() {
			return {
				error: "",
				status: "",
				slug: "",
				article: "",

				imported: "",
				origins: [],

				hub: null,
				articleNode: null
			};
		},
		async mounted() {
			const language = this.$router.currentParams.language;
			const subgroup = this.$router.currentParams.subgroup || "";
			this.slug = language + (subgroup && `/${subgroup}`);

			this.article = this.$router.currentParams.article;

			this.hub = new Hub(this.slug);
			try {
				await this.hub.init();
			} catch(e) {
				this.error = e.message;
				this.status = "error";
				return;
			}

			try {
				this.origins = await this.hub.getAritcleOrigins(this.article);
			} catch(e) {
				if(e instanceof NotEnoughError) {
					this.status = "no-article";
				} else {
					this.error = e.message;
					this.status = "error";
				}
				return;
			}

			if(this.origins.indexOf("") > -1 && this.origins.length > 1) {
				// There are both imported and local versions
				this.imported = "";
				this.origins.splice(this.origins.indexOf(""), 1);
			} else if(this.origins.indexOf("") == -1 && this.origins.length > 1) {
				// There are only imported versions
				this.imported = "ask";
				return;
			} else if(this.origins.length == 1 && this.origins[0] == "") {
				// There is only local version
				this.imported = "";
				this.origins = [];
			} else {
				// There is only imported version
				this.$router.navigate(`imported/${this.slug}/${toSlug(this.origins[0])}/${this.article}`);
				return;
			}

			try {
				this.articleNode = await this.hub.getArticle(this.article, "");
			} catch(e) {
				if(e instanceof NotEnoughError) {
					this.status = "no-article";
				} else {
					this.error = e.message;
					this.status = "error";
				}
				return;
			}
		},
		components: {
			"render-article": RenderArticle
		},
		methods: {
			toSlug
		}
	};
</script>