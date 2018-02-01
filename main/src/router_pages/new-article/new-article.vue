<template>
	<div>
		<div v-if="status == 'error'">
			<h1>Error</h1>
			<p>{{error}}</p>
		</div>
		<div v-else>
			<hub-header :hub="hub" v-if="status == 'hubLoaded'" />

			<h1>Create a new article</h1>

			<p>
				<a :href="`?/import-article/${slug}`" @click.prevent="$router.navigate(`import-article/${slug}`)">or import it.</a>
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
				name="Content"
				description="Markdown supported"
				ref="content"
				:multiline="true"
				v-model="content"
			/>

			<s-button value="Publish" @click="publish" />
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

				title: "",
				content: "",

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
			async publish() {
				if(!this.title) {
					this.$zeroPage.error("Please fill title");
					return;
				}

				const slug = await this.hub.publishArticle(this.title, this.content);

				this.$router.navigate(`wiki/${this.slug}/${slug}`);
			}
		}
	};
</script>