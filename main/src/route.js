import ZeroFrame from "./libs/ZeroFrame.js";
const zf = new ZeroFrame();

import ZeroPage from "zero-dev-lib/ZeroPage";
const zp = new ZeroPage(zf);

import ZeroFS from "zero-dev-lib/ZeroFS";
const zeroFS = new ZeroFS(zp);

import ZeroDB from "zero-dev-lib/ZeroDB";
const zeroDB = new ZeroDB(zp);

import ZeroAuth from "zero-dev-lib/ZeroAuth";
const zeroAuth = new ZeroAuth(zp);
zp.auth = zeroAuth;

import Vue from "vue/dist/vue.min.js";
import VueRouter from "./libs/vuerouter.js";
const router = VueRouter(zp);
Vue.use(router.plugin);

zp.on("wrapperPopState", res => router.router.listenForBack(res.params));

import Routes from "./router_pages/routes.js";
export const route = vue => {
	const routes = Routes(vue, zp);

	routes.forEach(route => router.router.add(route));
	router.router.check(router.router.getURL());
};

export {zp as zeroPage, zeroDB, zeroFS, zeroAuth};