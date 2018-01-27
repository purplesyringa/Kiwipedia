<template>
	<div>
		<div v-if="status == 'no-article'">
			<h1>No article named <i>{{article}}</i></h1>
			<p>
				<a :href="'?/import-article/' + slug" @click.prevent="$router.navigate('import-article/' + slug)">Want to import one?</a>
			</p>
		</div>
		<div v-else-if="status == 'error'">
			<h1>Error</h1>
			<p>{{error}}</p>
		</div>
		<div v-else-if="status == 'missing'">
			<hub-header :hub="hub" />

			<h1>Local</h1>
			<p v-if="imported = 'localOnly'">
				This is a local article, though you opened it as imported from <b>{{$router.currentParams.origin}}</b>. Try to <a :href="`?/wiki/${slug}/${article}`" @click.prevent="$router.navigate(`wiki/${slug}/${article}`)">open a local version</a>.
			</p>
			<p v-else-if="imported == 'importedOnly'">
				This is an imported article, though it wasn't imported from <b>{{$router.currentParams.origin}}</b>. Choose between
				<span v-for="origin in origins">
					<a :href="`?/imported/${slug}/${toSlug(origin)}/${article}`" @click.prevent="$router.navigate(`imported/${slug}/${toSlug(origin)}/${article}`)">{{origin}}</a>
					<span> </span>
				</span> origins.
			</p>
			<p v-else-if="imported == 'localAndImported'">
				This is both a local and an imported article, though it wasn't imported from <b>{{$router.currentParams.origin}}</b>. Choose between
				<span v-for="origin in origins">
					<a :href="`?/imported/${slug}/${toSlug(origin)}/${article}`" @click.prevent="$router.navigate(`imported/${slug}/${toSlug(origin)}/${article}`)">{{origin}}</a>
					<span> </span>
				</span> origins or <a :href="`?/wiki/${slug}/${article}`" @click.prevent="$router.navigate(`wiki/${slug}/${article}`)">open a local version</a>.
			</p>
		</div>
		<div v-else-if="articleNode">
			<hub-header :hub="hub" />

			<h1>
				{{articleNode.title}}
				<a class="history-icon" :href="`?/article-history/${slug}/${article}`" @click.prevent="$router.navigate(`article-history/${slug}/${article}`)">&#9776;</a>
			</h1>

			<div class="ambox ambox-notice" v-if="imported == 'localOnly'">
				<b>This article has a local version you may want to look at.</b><br>
				<a :href="`?/wiki/${slug}/${article}`" @click.prevent="$router.navigate(`wiki/${slug}/${article}`)">Visit it.</a>
			</div>
			<div class="ambox ambox-notice" v-else-if="imported == 'importedOnly'">
				<b>This article has other imported version(s) you may want to look at.</b><br>
				Choose between
				<span v-for="origin in origins">
					<a :href="`?/imported/${slug}/${toSlug(origin)}/${article}`" @click.prevent="$router.navigate(`imported/${slug}/${toSlug(origin)}/${article}`)">{{origin}}</a>
					<span> </span>
				</span>.
			</div>
			<div class="ambox ambox-notice" v-else-if="imported == 'localAndImported'">
				<b>This article has a local version and other imported version(s) you may want to look at.</b><br>
				Choose between
				<span v-for="origin in origins">
					<a :href="`?/imported/${slug}/${toSlug(origin)}/${article}`" @click.prevent="$router.navigate(`imported/${slug}/${toSlug(origin)}/${article}`)">{{origin}}</a>
					<span> </span>
				</span> or <a :href="`?/wiki/${slug}/${article}`" @click.prevent="$router.navigate(`wiki/${slug}/${article}`)">open a local version</a>.
			</div>

			<render-article :text="articleNode.text" :slug="slug" />
		</div>
		<loading v-else />
	</div>
</template>

<style lang="sass" src="./imported.sass"></style>

<script type="text/javascript">
	import Hub, {toSlug, NotEnoughError, TooMuchError} from "../../common/hub.js";
	import RenderArticle from "../article/render-article.vue";

	export default {
		name: "imported",
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
			let origin = this.$router.currentParams.origin;
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

			const index = this.origins.findIndex(curOrigin => toSlug(curOrigin) == origin);
			if(index == -1) {
				this.status = "missing";
				if(this.origins.indexOf("") > -1 && this.origins.length == 1) {
					this.imported = "localOnly";
				} else if(this.origins.indexOf("") > -1 && this.origins.length > 1) {
					this.imported = "localAndImported";
				} else if(this.origins.indexOf("") == -1) {
					this.imported = "importedOnly";
				}
				return;
			}

			origin = this.origins[index];

			this.origins.splice(index, 1);

			if(this.origins.indexOf("") > -1 && this.origins.length > 1) {
				// There are both imported and local versions
				this.imported = "localAndImported";
				this.origins.splice(this.origins.indexOf(""), 1);
			} else if(this.origins.indexOf("") == -1 && this.origins.length > 0) {
				// There are imported versions
				this.imported = "importedOnly";
			} else if(this.origins.length == 1 && this.origins[0] == "") {
				// There is only local version
				this.imported = "localOnly";
				this.origins = [];
			}

			try {
				this.articleNode = await this.hub.getArticle(this.article, origin);
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