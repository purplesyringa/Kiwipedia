<style lang="sass" src="./sidebar.sass" scoped></style>

<template>
	<aside>
		<img src="./kiwi.svg" class="logo">
		<h1 class="title">Zero<span>Wikipedia</span></h1>
		<p>
			Logo by <a href="https://www.iconfinder.com/zapolzun">Anastasia Kuznetsova</a>
		</p>

		<p>
			Wikipedia for ZeroNet with auto-import.<br>
			Made with &#128155; by <a href="/Mail.ZeroNetwork.bit/?to=gitcenter">GitCenter</a> and community.
		</p>

		<p>
			<a href="?/" @click.prevent="$router.navigate('')">
				Home
			</a><br>
			<a href="?/hub-list" @click.prevent="$router.navigate('hub-list')">
				Hub list
			</a>
		</p>

		<p>
			<a href="?/new-hub" @click.prevent="$router.navigate('new-hub')">
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