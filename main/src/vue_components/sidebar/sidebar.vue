<style lang="sass" src="./sidebar.sass" scoped></style>

<template>
	<aside>
		<h1>ZeroWikipedia</h1>
		<p>
			Wikipedia for ZeroNet with auto-import.<br>
			Made with &#128155; by <a href="/Mail.ZeroNetwork.bit/?to=gitcenter">GitCenter</a> and community.
		</p>

		<p>
			<a href="?/" @click.prevent="$router.navigate('')">
				Home
			</a><br>
			<a href="?/new-language" @click.prevent="$router.navigate('new-language')">
				Don't see you language in list?
			</a><br>
			<a href="/13c2MpR9ztCzVm7r8cTfV9h9FFEEiQ6AKD">
				Want to request a feature or report a bug?
			</a>
		</p>
	</aside>
</template>

<script language="text/javascript">
	export default {
		props: [],
		name: "sidebar"
	};
</script>