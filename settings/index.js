function launch() {
	let url = "../?"
	if (PNAME.value && APORT.value) {
		url = url + "&name=" + PNAME.value;
		url = url + "&port=" + APORT.value;
	}
	url = url + "&hi=" + HI.value;
	url = url + "&r3=" + R3.value;
	url = url + "&fc=" + FC.value;
	url = url + "&vg=" + VG.value;
	url = url + "&r22=" + R22.value;
	url = url + "&vr=" + VR.value;
	url = url + "&e4=" + E4.value;
	url = url + "&cc=" + CC.value;
	url = url.replace("?&", "?");
	window.open(url, "_self");
}