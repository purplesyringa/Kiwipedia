<template>
	<div>
		<h1>Welcome to ZeroWikipedia</h1>
		<p>
			ZeroWikipedia is a wiki platform for ZeroNet.
		</p>
		<p>
			Help us by <a href="?/new-article/en" @click.prevent="$router.navigate('new-article/en')">adding a new article to English version</a>, <a href="?/new-hub" @click.prevent="$router.navigate('new-hub')">create a new topic for another language</a> or join our development group at <a href="/13c2MpR9ztCzVm7r8cTfV9h9FFEEiQ6AKD">Git Center</a> or <a href="https://github.com/imachug/ZeroWikipedia">GitHub</a>.
		</p>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: "home"
	};
</script>