import "./sass/main.sass";

import Vue from "vue/dist/vue.min.js";

import AsyncComputed from "vue-async-computed";
Vue.use(AsyncComputed);

import root from "./vue_components/root.vue";
var app = new Vue({
	el: "#app",
	render: h => h(root),
	data: {
		currentView: null,
		zeroPage: null
	}
});

import Setting from "./vue_components/setting/setting.vue";
Vue.component("setting", Setting);

import SButton from "./vue_components/s-button/s-button.vue";
Vue.component("s-button", SButton);

import Loading from "./vue_components/loading/loading.vue";
Vue.component("loading", Loading);

import {route, zeroPage} from "./route.js";
route(app);

Vue.prototype.$zeroPage = zeroPage;