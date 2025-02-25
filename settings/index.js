function launch() {
	let url = "../?"
	if (PNAME.value && APORT.value) {
		url = url + "&name=" + PNAME.value;
		url = url + "&port=" + APORT.value;
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