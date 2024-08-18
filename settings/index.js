function launch() {
	let url = "../?"
	if (PNAME.value && APORT.value) {
		url = url + "&name=" + PNAME.value;
		url = url + "&port=" + APORT.value;
	}
	url = url + "&bt=" + BT.value;
	url = url + "&hi=" + HI.value;
	url = url + "&nr=" + NR.value;
	url = url + "&nc=" + NC.value;
	url = url + "&er=" + ER.value;
	url = url + "&ec=" + EC.value;
	url = url + "&g=" + G.value;
	url = url.replace("?&", "?");
	window.open(url, "_self");
}