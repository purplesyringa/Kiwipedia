<template>
	<div>
		<div v-if="status == 'no-article'">
			<h1>No article named <i>{{article}}</i></h1>
			<p>
				<a :href="'?/new-article/' + slug" @click.prevent="$router.navigate('new-article/' + slug)">Want to create one?</a>
			</p>
		</div>
		<div v-else>
			<h1>
				{{header}}
				<a class="edit-icon" :href="`?/edit-article/${slug}/${article}`" @click.prevent="$router.navigate(`edit-article/${slug}/${article}`)">&#9998;</a>
			</h1>

			<p v-if="hub">
				From <b>{{hub.language}}</b>
				<b v-if="hub.subgroup != ''"> | {{hub.subgroup}}</b>
			</p>

			<p>{{content}}</p>
		</div>
	</div>
</template>

<style lang="sass" src="./article.sass"></style>

<script type="text/javascript">
	import Hub, {NotEnoughError, TooMuchError} from "../../common/hub.js";

	export default {
		name: "article",
		data() {
			return {
				header: "",
				content: "",
				status: "",
				slug: "",
				article: "",

				hub: null
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
				this.header = "Error";
				this.content = e.message;
				this.status = "error";
				return;
			}

			let article;
			try {
				article = await this.hub.getArticle(this.article);
			} catch(e) {
				if(e instanceof NotEnoughError) {
					this.status = "no-article";
				}
				return;
			}

			this.header = article.title;
			this.content = article.text;
		}
	};
</script>