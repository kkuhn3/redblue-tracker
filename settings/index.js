function launch() {
	let url = "../?"
	if (AHOST.value && ANAME.value && APORT.value) {
		url = url + "&name=" + ANAME.value;
		url = url + "&port=" + APORT.value;
		if (AHOST.value !== "archipelago.gg") {
			url = url + "&host=" + AHOST.value;
		}
		if (APASS.value) {
			url = url + "&pass=" + APASS.value;
		}
	}
	for (let select of document.getElementsByTagName('select')) {
		if (select.value) {
			url = url + '&' + select.id.toLowerCase() + '=' + select.value;
		}
	}
	url = url.replace("?&", "?");
	if (url === "../?") {
		url = "../";
	}
	window.open(url, "_self");
}