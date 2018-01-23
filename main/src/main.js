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

import {route, zeroPage} from "./route.js";
route(app);

Vue.prototype.$zeroPage = zeroPage;