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
		<div v-else-if="articleNode">
			<h1>
				{{articleNode.title}}
				<a class="edit-icon" :href="`?/edit-article/${slug}/${article}`" @click.prevent="$router.navigate(`edit-article/${slug}/${article}`)">&#9998;</a>
			</h1>

			<p class="origin">
				From <b>{{hub.language}}</b>
				<b v-if="hub.subgroup != ''"> | {{hub.subgroup}}</b>
			</p>

			<p>{{articleNode.text}}</p>
		</div>
		<loading v-else />
	</div>
</template>

<style lang="sass" src="./article.sass"></style>

<script type="text/javascript">
	import Hub, {NotEnoughError, TooMuchError} from "../../common/hub.js";

	export default {
		name: "article",
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

			this.hub = new Hub(this.slug);
			try {
				await this.hub.init();
			} catch(e) {
				this.error = e.message;
				this.status = "error";
				return;
			}

			try {
				this.articleNode = await this.hub.getArticle(this.article);
			} catch(e) {
				if(e instanceof NotEnoughError) {
					this.status = "no-article";
				} else {
					this.error = e.message;
					this.status = "error";
				}
				return;
			}
		}
	};
</script>