function count_badges() {
	let count = 0;
	const badges = ["Boulder_Badge", "Cascade_Badge", "Thunder_Badge", "Rainbow_Badge", "Soul_Badge", "Marsh_Badge", "Volcano_Badge", "Earth_Badge"];
	for (const badge of badges) {
		const badgeDiv = document.getElementById(badge);
		if (badgeDiv.classList.contains("itemchecked")) {
			count = count + 1;
		}
	}
	return count;
}

function e4_open() {
	let needed = parseInt(E4_COUNT.classList[1].substring(1), 10);
	let count = -1;
	if (parseInt(E4_REQ.classList[1].substring(1), 10)) {
		count = count_gyms();
	}
	else {
		count = count_badges();
	}
	return count >= needed;
}

function has(item) {
	const itemdiv = document.getElementById(item);
	if (!itemdiv) {
		return false;
	}
	return itemdiv.classList.contains("locationchecked") || 
		   itemdiv.classList.contains("itemchecked") ||
		   itemdiv.classList.contains("subchecked");
}

function can_cut() {
	return has("Cascade_Badge") && has("HM01_Cut");
}

function can_flash() {
	return has("Boulder_Badge") && has("HM05_Flash");
}

function can_strength() {
	return has("Rainbow_Badge") && has("HM04_Strength");
}

function can_surf() {
	return has("Soul_Badge") && has("HM03_Surf");
}

function hidden_logic() {
	if (has("ITEM_ITEMFINDER")) {
		return "logical";
	}
	return "possible";
}

function can_pewter() {
	return true;
}
function can_route3() {
	return false;
}
function can_vermilion() {
	return can_route3() || can_cut();
}

const locationHighlight = {
	"EVENT_DEFEAT_CHAMPION": function() {
		
	}
}

const locationLogic = {
	//Cities
	//Pallet Town
	//Vermilion City
	"Rod_Vermilion_City_Fishing_Guru": function() {
		if (can_vermilion()) {
			return "logical";
		}
	},
	//Routes
	//1
}