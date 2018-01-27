<template>
	<div>
		<div v-if="status == 'error'">
			<h1>Error</h1>
			<p>{{error}}</p>
		</div>
		<div v-else>
			<hub-header :hub="hub" v-if="status == 'hubLoaded'" />

			<h1>Import an article</h1>

			<p>
				<a :href="`?/new-article/${slug}`" @click.prevent="$router.navigate(`new-article/${slug}`)">or create it from scratch.</a>
			</p>

			<p v-if="isFirst">
				This is the first article, so it will be marked as <b>home</b>.
			</p>

			<setting
				name="Title"
				description=""
				ref="title"
				v-model="title"
			/>

			<setting
				name="Source"
				description="Use http[s]://{language}.wikipedia.org/wiki/{article} for Wikipedia.org, zerowiki://{article} for original ZeroWiki and zerowiki://{address}/{article} for ZeroWiki clones"
				ref="source"
				v-model="source"
			/>

			<s-button value="Import" @click="importArticle" />
		</div>
	</div>
</template>

<script type="text/javascript">
	import Hub, {NotEnoughError, TooMuchError} from "../../common/hub.js";
	import importer from "../../common/importer.js";

	export default {
		name: "import-article",
		data() {
			return {
				slug: "",
				status: "",
				error: "",

				title: "",
				source: "",

				isFirst: false,

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

			const index = await this.hub.getIndex();
			if(index.length == 0) {
				this.isFirst = true;
				this.$refs.title.disabled = true;
				this.title = "Home";
			}

			this.status = "hubLoaded";
		},
		methods: {
			async importArticle() {
				let content;
				try {
					content = await importer(this.source);
				} catch(e) {
					this.$zeroPage.error(e.message);
					return;
				}

				const slug = await this.hub.publishArticle(this.title, content);

				this.$router.navigate(`wiki/${this.slug}/${slug}`);
			}
		}
	};
</script>