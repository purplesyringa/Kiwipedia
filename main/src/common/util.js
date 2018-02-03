export function base64encode(str) {
	return btoa(unescape(encodeURIComponent(str)));
};
export function base64decode(str) {
	return decodeURIComponent(escape(atob(str)));
};