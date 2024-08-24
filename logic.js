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
function count_gyms() {
	let count = 0;
	const badges = ["EVENT_DEFEAT_GIOVANNI", "EVENT_DEFEAT_BROCK", "EVENT_DEFEAT_MISTY", "EVENT_DEFEAT_SURGE", "EVENT_DEFEAT_ERIKA", "EVENT_DEFEAT_SABRINA", "EVENT_DEFEAT_KOGA", "EVENT_DEFEAT_BLAINE"];
	for (const badge of badges) {
		const badgeDiv = document.getElementById(badge);
		if (badgeDiv.classList.contains("subchecked")) {
			count = count + 1;
		}
	}
	return count;
}
function count_fossils() {
	let count = 0;
	const badges = ["Dome_Fossil", "Helix_Fossil", "Old_Amber"];
	for (const badge of badges) {
		const badgeDiv = document.getElementById(badge);
		if (badgeDiv.classList.contains("itemchecked")) {
			count = count + 1;
		}
	}
	return count;
}

function has(item) {
	const itemdiv = document.getElementById(item);
	if (!itemdiv) {
		return false;
	}
	if (itemdiv.classList.contains("locationchecked") || 
		   itemdiv.classList.contains("itemchecked") ||
		   itemdiv.classList.contains("subchecked")) {
		return "logical";
	}
}

function can_cut() {
	if (has("Cascade_Badge") && has("HM01_Cut")) {
		return "logical";
	}
}

function can_flash() {
	if (has("Boulder_Badge") && has("HM05_Flash")) {
		return "logical";
	}
}

function can_strength() {
	if (has("Rainbow_Badge") && has("HM04_Strength")) {
		return "logical";
	}
}

function can_surf() {
	if (has("Soul_Badge") && has("HM03_Surf")) {
		return "logical";
	}
}

function hidden_logic() {
	if (has("Item_Finder")) {
		return "logical";
	}
	return "possible";
}
// Logic Helpers
function can_fuchsia_from_seafoam() {
	return can_surf() && can_strength();
}
function can_route3_from_pewter() {
	const r3id = parseInt(ROUTE_3_CONDITION.classList[1].substring(1), 10);
	if (r3id === 0) {
		return true;
	}
	else if (r3id === 1) {
		return has("EVENT_DEFEAT_BROCK");
	}
	else if (r3id === 2) {
		return count_gyms() > 0;
	}
	else if (r3id === 3) {
		return has("Boulder_Badge");
	}
	else if (r3id === 4) {
		return count_badges() > 0;
	}
}
function can_plot_to_cerulean() {
	return can_route3_from_pewter() && has("EVENT_RETURN_PARCEL");
}
function can_plot_to_vermilion() {
	return can_plot_to_cerulean() && has("EVENT_RESCUE_BILL");
}

// Town Logic
// Pallet - logical
// Viridian - logical
function can_viridianGym() {
	const badges = parseInt(VIRIDIAN_GYM_CONDITION.classList[1].substring(1), 10);
	if (count_badges() >= badges) {
		return "logical";
	}
}
function can_pewter() {
	// From Pallet-Viridian
	if (can_cut()) {
		return "logical";
	}
	if (has("EVENT_RETURN_PARCEL")) {
		return "logical";
	}
	// From Pallet-Cinibar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		//-Vermilion-Cerulean
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Lavender-Saffron-Cerulean
		if (has("Tea")) {
			return "logical";
		}
	}
}
function can_cerulean() {
	// From Pallet-Viridian-Vermilion
	if (can_cut()) {
		return "logical";
	}
	// From Pallet-Viridian-Pewter
	if (can_plot_to_cerulean()) {
		return "logical";
	}
	// From Pallet-Cinibar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		//-Vermilion
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Lavender-Saffron
		if (has("Tea")) {
			return "logical";
		}
	}
}
function can_ceruleanCave() {
	const badges = parseInt(CERULEAN_CAVE_CONDITION.classList[1].substring(1), 10);
	if (can_cerulean() && can_surf() && count_badges() >= badges) {
		return "logical";
	}
}
function can_vermilion() {
	// From Pallet-Viridian
	if (can_cut()) {
		return "logical";
	}
	// From Pallet-Viridian-Pewter-Cerulean
	if (can_plot_to_vermilion()) {
		return "logical";
	}
	// From Pallet-Cinibar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Lavender-Saffron
		if (has("Tea")) {
			return "logical";
		}
	}
}
function can_ssAnne() {
	if (can_vermilion() && has("SS_Ticket")) {
		return "logical";
	}
}
function can_lavender() {
	// From Pallet-Viridian-Pewter-Cerulean
	if (can_plot_to_vermilion()) {
		//-Saffron
		if (has("Tea")) {
			return "logical";
		}
		//-Vermilion
		if (has("Poke_Flute")) {
			return "logical";
		}
	}
	// From Pallet-Cinnabar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		return "logical";
	}
	// From Pallet-Viridian-Vermilion
	if (can_cut()) {
		//-Saffron
		if (has("Tea")) {
			return "logical";
		}
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Cerulean
		if (can_flash()) {
			return "logical";
		}
		return "possible";
	}
}
function can_celadon() {
	// No requirements between these two towns.
	return can_lavender();
}
function can_celadonHidden() {
	const celadonable = can_celadon();
	if (celadonable === "logical") {
		return hidden_logic();
	}
	return celadonable;
}
function can_saffron() {
	// Always need tea
	if (has("Tea")) {
		// From Pallet-Viridian-Vermilion
		if (can_cut()) {
			return "logical";
		}
		// From Pallet-Viridian-Pewter-Cerulean
		if (can_plot_to_vermilion()) {
			return "logical";
		}
		// From Pallet-Cinnabar-Fuchsia
		if (can_fuchsia_from_seafoam()) {
			return "logical";
		}
	}
}
function can_silph() {
	if (can_saffron() && has("EVENT_RESCUE_FUJI")) {
		return "logical";
	}
}
function can_silphCardKey() {
	if (can_silph() && has("Card_Key")) {
		return "logical";
	}
}
function can_saffronGym() {
	if (can_saffron() && has("EVENT_FREE_SILPH")) {
		return "logical";
	}
}
function can_fuchsia() {
	// From Pallet-Cinnabar
	if (can_fuchsia_from_seafoam()) {
		return "logical";
	}
	// From Pallet-Viridian-Pewter-Cerulean-Vermilion
	if (can_plot_to_vermilion()) {
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Saffron-Lavender
		if (can_surf() && has("Tea")) {
			return "logical";
		}
	}
	// From Pallet-Viridian-Vermilion
	if (can_cut()) {
		if (has("Poke_Flute")) {
			return "logical";
		}
		if (can_surf()) {
			// -Saffron-Lavender
			if (has("Tea")) {
				return "logical";
			}
			// -Cerulean-Lavender
			if (can_flash()) {
				return "logical";
			}
			return "possible";
		}
	}
}
function can_fuchsiaHidden() {
	const fuchsiaable = can_fuchsia();
	if (fuchsiaable === "logical") {
		return hidden_logic();
	}
	return fuchsiaable;
}
function can_cinnabar() {
	if (can_surf()) {
		return "logical";
	}
}
function can_fossils() {
	const fossils = parseInt(FOSSILS_CONDITION.classList[1].substring(1), 10);
	if (count_fossils() >= fossils) {
		return can_cinnabar();
	}
}
// Route Logic
// 1 - logical
// 2 - can_pewter()
// 3 - 
function can_route3() {
	// From Pallet-Viridian-Pewter
	if (can_route3_from_pewter()) {
		if (can_cut()) {
			return "logical";
		}
		if (has("EVENT_RETURN_PARCEL")) {
			return "logical";
		}
	}
	// From Pallet-Viridian-Vermilion-Cerulean
	if (can_cut() && can_surf()) {
		return "logical";
	}
	// From Pallet-Cinibar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		//-Vermilion-Cerulean
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Lavender-Saffron-Cerulean
		if (has("Tea")) {
			return "logical";
		}
	}
}
// 4 - can_route3()
// 5 - can_vermilion()
// 6 - can_vermilion()
// 7 - can_celadon()
// 8 - can_lavender()
// 9 
function can_route9() {
	if (can_cut()) {
		return "logical";
	}
	if (can_lavender()) {
		if (can_flash()) {
			return "logical";
		}
		return "possible";
	}
}
function can_route9Hidden() {
	const route9able = can_route9();
	if (route9able === "logical") {
		return hidden_logic();
	}
	return route9able;
}
// 10 North - can_route9()
// 10 South - can_lavender()
// 11 - can_vermillion()
// 12 North - can_lavender()
// 12 South - can_fuchsia()
// 13 - can_fuchsia()
// 14 - can_fuchsia()
// 15 - can_fuchsia()
// 16 East - can_celadon()
// 16 West - can_fuchsia()
// 17 - can_route16West()
// 18 West - can_route16West()
// 18 East - can_fuchsia()
// 19 - Barren
// 20 East - can_route19()
// 20 West - can_cinnabar()
// 21 - can_cinnabar()
// 22 - logical
// 23 
function can_route23South() {
	const badges = parseInt(ROUTE_22_CONDITION.classList[1].substring(1), 10);
	if (count_badges() >= badges) {
		return "logical";
	}
}
function can_victoryRoad() {
	const badges = parseInt(VICTORY_ROAD_CONDITION.classList[1].substring(1), 10);
	if (can_route23South() && can_surf() && count_badges() >= badges) {
		return "logical";
	}
}
function can_vitoryRoadComplete() {
	if (can_victoryRoad() && can_strength()) {
		return "logical";
	}
}
function can_e4() {
	const badges = parseInt(ELITE_4_CONDITION.classList[1].substring(1), 10);
	if (can_vitoryRoadComplete() && count_badges() >= badges) {
		return "logical";
	}
}
// 24 - can_cerulean()
// 25 - can_cerulean()

const locationHighlight = {}

const locationLogic = {
	// ////////////////////
	// Cities
	// ////////////////////
	// Pallet Town
	"PC_Item": function() {
		return "logical";
	},
	"Event_Rivals_Sister": function() {
		return has("EVENT_RETURN_PARCEL");
	},
	"EVENT_RETURN_PARCEL": function() {
		return has("Oaks_Parcel");
	},
	"Event_Pokedex": function() {
		return has("Oaks_Parcel");
	},
	"Event_Oaks_Gift": function() {
		return has("EVENT_RETURN_PARCEL");
	},
	// Viridian City
	"Event_Sleepy_Guy": function() {
		if (can_cut() || can_surf()) {
			return "logical";
		}
	},
	"Event_Pokemart_Quest": function() {
		return "logical";
	},
	// Viridian Gym
	"Missable_Viridian_Gym_Item": function() {
		return can_viridianGym();
	},
	"EVENT_DEFEAT_GIOVANNI": function() {
		return can_viridianGym();
	},
	"Badge_Viridian_Gym": function() {
		return can_viridianGym();
	},
	"Event_Viridian_Gym": function() {
		return can_viridianGym();
	},
	"Hidden_Item_Viridian_City": function() {
		return hidden_logic();
	},
	// Pewter City
	"Event_Museum": function() {
		if (can_pewter() && can_cut()) {
			return "logical";
		}
	},
	// Pewter Gym
	"EVENT_DEFEAT_BROCK": function() {
		return can_pewter();
	},
	"Badge_Pewter_Gym": function() {
		return can_pewter();
	},
	"Event_Pewter_Gym": function() {
		return can_pewter();
	},
	// Cerulean City
	"Event_Bicycle_Shop": function() {
		if (can_cerulean() && has("Bike_Voucher")) {
			return "logical";
		}
	},
	// Cerulean Gym
	"EVENT_DEFEAT_MISTY": function() {
		return can_cerulean();
	},
	"Badge_Cerulean_Gym": function() {
		return can_cerulean();
	},
	"Event_Cerulean_Gym": function() {
		return can_cerulean();
	},
	"Event_Rocket_Thief": function() {
		return can_vermilion();
	},
	// Cerulean Cave
	"Missable_Cerulean_Cave_2F_Item_1": function() {
		return can_ceruleanCave();
	},
	"Missable_Cerulean_Cave_1F_Item_2": function() {
		return can_ceruleanCave();
	},
	"Missable_Cerulean_Cave_1F_Item_1": function() {
		return can_ceruleanCave();
	},
	"Missable_Cerulean_Cave_1F_Item_3": function() {
		return can_ceruleanCave();
	},
	"Hidden_Item_Cerulean_Cave_1F": function() {
		if (can_ceruleanCave()) {
			return hidden_logic();
		}
	},
	"Missable_Cerulean_Cave_2F_Item_3": function() {
		return can_ceruleanCave();
	},
	"Missable_Cerulean_Cave_2F_Item_2": function() {
		return can_ceruleanCave();
	},
	"Missable_Cerulean_Cave_B1F_Item_2": function() {
		return can_ceruleanCave();
	},
	"Missable_Cerulean_Cave_B1F_Item_1": function() {
		return can_ceruleanCave();
	},
	"Hidden_Item_Cerulean_Cave_B1F": function() {
		if (can_ceruleanCave()) {
			return hidden_logic();
		}
	},
	"Hidden_Item_Cerulean_City": function() {
		if (can_cerulean()) {
			return hidden_logic();
		}
	},
	// Vermilion City
	"Rod_Vermilion_City_Fishing_Guru": function() {
		return can_vermilion();
	},
	"Event_Pokemon_Fan_Club": function() {
		return can_vermilion();
	},
	// Vermilion Gym
	"EVENT_DEFEAT_SURGE": function() {
		if (can_vermilion() && (can_surf() || can_cut())) {
			return "logical";
		}
	},
	"Badge_Vermilion_Gym": function() {
		if (can_vermilion() && (can_surf() || can_cut())) {
			return "logical";
		}
	},
	"Event_Vermillion_Gym": function() {
		if (can_vermilion() && (can_surf() || can_cut())) {
			return "logical";
		}
	},
	// SS Anne
	"Missable_SS_Anne_B1F_Item_3": function() {
		return can_ssAnne();
	},
	"Missable_SS_Anne_B1F_Item_1": function() {
		return can_ssAnne();
	},
	"Missable_SS_Anne_B1F_Item_2": function() {
		return can_ssAnne();
	},
	"Hidden_Item_SS_Anne_B1F": function() {
		if (can_ssAnne()) {
			return hidden_logic();
		}
	},
	"Missable_SS_Anne_1F_Item": function() {
		return can_ssAnne();
	},
	"Hidden_Item_SS_Anne_Kitchen": function() {
		if (can_ssAnne()) {
			return hidden_logic();
		}
	},
	"Missable_SS_Anne_2F_Item_1": function() {
		return can_ssAnne();
	},
	"Missable_SS_Anne_2F_Item_2": function() {
		return can_ssAnne();
	},
	"Event_SS_Anne_Captain": function() {
		return can_ssAnne();
	},
	"Hidden_Item_Vermilion_City": function() {
		if (can_vermilion()) {
			return hidden_logic();
		}
	},
	// Lavender Town
	"Event_Fuji": function() {
		if (has("EVENT_RESCUE_FUJI")) {
			return can_lavender();
		}
	},
	// Pokemon Tower
	"Missable_Pokemon_Tower_3F_Item": function() {
		return can_lavender();
	},
	"Missable_Pokemon_Tower_4F_Item_1": function() {
		return can_lavender();
	},
	"Missable_Pokemon_Tower_4F_Item_2": function() {
		return can_lavender();
	},
	"Missable_Pokemon_Tower_4F_Item_3": function() {
		return can_lavender();
	},
	"Hidden_Item_Pokemon_Tower_5F": function() {
		return can_celadonHidden();
	},
	"Missable_Pokemon_Tower_5F_Item": function() {
		return can_lavender();
	},
	"Missable_Pokemon_Tower_6F_Item_2": function() {
		return can_lavender();
	},
	"Missable_Pokemon_Tower_6F_Item_1": function() {
		return can_lavender();
	},
	"EVENT_RESCUE_FUJI": function() {
		if (has("Silph_Scope")) {
			return can_lavender();
		}
	},
	// Celadon City
	"Event_Mansion_Lady": function() {
		return can_celadon();
	},
	"Event_Stranded_Man": function() {
		if (can_surf()) {
			return can_celadon();
		}
	},
	// Celadon Department Store
	"Event_Counter": function() {
		return can_celadon();
	},
	"Event_Thirsty_Girl_Water": function() {
		return can_celadon();
	},
	"Event_Thirsty_Girl_Soda": function() {
		return can_celadon();
	},
	"Event_Thirsty_Girl_Lemonade": function() {
		return can_celadon();
	},
	"Event_Gambling_Addict": function() {
		return can_celadon();
	},
	// Celadon Gym
	"EVENT_DEFEAT_ERIKA": function() {
		if (can_cut()) {
			return can_celadon();
		}
	},
	"Badge_Celadon_Gym": function() {
		if (can_cut()) {
			return can_celadon();
		}
	},
	"Event_Celadon_Gym": function() {
		if (can_cut()) {
			return can_celadon();
		}
	},
	// Celadon Game Corner
	"Event_Game_Corner_Gift_A": function() {
		if (has("Coin_Case")) {
			return can_celadon();
		}
	},
	"Event_Game_Corner_Gift_C": function() {
		if (has("Coin_Case")) {
			return can_celadon();
		}
	},
	"Event_Game_Corner_Gift_B": function() {
		if (has("Coin_Case")) {
			return can_celadon();
		}
	},
	"Hidden_Item_Game_Corner_1": function() {
		if (has("Coin_Case")) {
			return can_celadonHidden();
		}
	},
	"Hidden_Item_Game_Corner_2": function() {
		if (has("Coin_Case")) {
			return can_celadonHidden();
		}
	},
	"Hidden_Item_Game_Corner_3": function() {
		if (has("Coin_Case")) {
			return can_celadonHidden();
		}
	},
	"Hidden_Item_Game_Corner_4": function() {
		if (has("Coin_Case")) {
			return can_celadonHidden();
		}
	},
	"Hidden_Item_Game_Corner_5": function() {
		if (has("Coin_Case")) {
			return can_celadonHidden();
		}
	},
	"Hidden_Item_Game_Corner_6": function() {
		if (has("Coin_Case")) {
			return can_celadonHidden();
		}
	},
	"Hidden_Item_Game_Corner_7": function() {
		if (has("Coin_Case")) {
			return can_celadonHidden();
		}
	},
	"Hidden_Item_Game_Corner_8": function() {
		if (has("Coin_Case")) {
			return can_celadonHidden();
		}
	},
	"Hidden_Item_Game_Corner_9": function() {
		if (has("Coin_Case")) {
			return can_celadonHidden();
		}
	},
	"Hidden_Item_Game_Corner_10": function() {
		if (has("Coin_Case")) {
			return can_celadonHidden();
		}
	},
	"Hidden_Item_Game_Corner_11": function() {
		if (has("Coin_Case")) {
			return can_celadonHidden();
		}
	},
	// Rocket Hideout
	"Hidden_Item_Rocket_Hideout_B1F": function() {
		return can_celadonHidden();
	},
	"Missable_Rocket_Hideout_B1F_Item_1": function() {
		return can_celadon();
	},
	"Missable_Rocket_Hideout_B3F_Item_1": function() {
		return can_celadon();
	},
	"Hidden_Item_Rocket_Hideout_B3F": function() {
		return can_celadonHidden();
	},
	"Missable_Rocket_Hideout_B3F_Item_2": function() {
		return can_celadon();
	},
	"Missable_Rocket_Hideout_B4F_Item_1": function() {
		return can_celadon();
	},
	"Missable_Rocket_Hideout_B4F_Item_2": function() {
		return can_celadon();
	},
	"Missable_Rocket_Hideout_B4F_Item_5": function() {
		return can_celadon();
	},
	"Missable_Rocket_Hideout_B2F_Item_2": function() {
		return can_celadon();
	},
	"Missable_Rocket_Hideout_B2F_Item_1": function() {
		return can_celadon();
	},
	"Missable_Rocket_Hideout_B2F_Item_3": function() {
		return can_celadon();
	},
	"Missable_Rocket_Hideout_B2F_Item_4": function() {
		return can_celadon();
	},
	"Missable_Rocket_Hideout_B1F_Item_2": function() {
		return can_celadon();
	},
	"Missable_Rocket_Hideout_B4F_Item_3": function() {
		if (has("Lift_Key")) {
			return can_celadon();
		}
	},
	"Missable_Rocket_Hideout_B4F_Item_4": function() {
		if (has("Lift_Key")) {
			return can_celadon();
		}
	},
	"Hidden_Item_Rocket_Hideout_B4F": function() {
		if (has("Lift_Key")) {
			return can_celadonHidden();
		}
	},
	"Hidden_Item_Celadon_City": function() {
		return can_celadonHidden();
	},
	// Saffron
	// Silph Co
	"Event_Scared_Woman": function() {
		return can_silphCardKey();
	},
	"Missable_Silph_Co_3F_Item": function() {
		return can_silphCardKey();
	},
	"Missable_Silph_Co_4F_Item_1": function() {
		return can_silphCardKey();
	},
	"Missable_Silph_Co_4F_Item_2": function() {
		return can_silphCardKey();
	},
	"Missable_Silph_Co_4F_Item_3": function() {
		return can_silphCardKey();
	},
	"Hidden_Item_Silph_Co_5F": function() {
		if (can_silph()) {
			return hidden_logic();
		}
	},
	"Missable_Silph_Co_5F_Item_1": function() {
		return can_silphCardKey();
	},
	"Missable_Silph_Co_5F_Item_2": function() {
		return can_silphCardKey();
	},
	"Missable_Silph_Co_5F_Item_3": function() {
		return can_silph();
	},
	"Missable_Silph_Co_6F_Item_1": function() {
		return can_silphCardKey();
	},
	"Missable_Silph_Co_6F_Item_2": function() {
		return can_silphCardKey();
	},
	"Missable_Silph_Co_7F_Item_1": function() {
		return can_silph();
	},
	"Missable_Silph_Co_7F_Item_2": function() {
		return can_silphCardKey();
	},
	"Hidden_Item_Silph_Co_9F": function() {
		if (can_silphCardKey()) {
			return hidden_logic();
		}
	},
	"Missable_Silph_Co_10F_Item_1": function() {
		return can_silph();
	},
	"Missable_Silph_Co_10F_Item_2": function() {
		return can_silph();
	},
	"Missable_Silph_Co_10F_Item_3": function() {
		return can_silph();
	},
	"EVENT_FREE_SILPH": function() {
		return can_silphCardKey();
	},
	"Event_Silph_Co_President": function() {
		return can_silphCardKey();
	},
	// Copycat's House
	"Event_Copycat": function() {
		return can_saffronGym();
	},
	"Hidden_Item_Copycats_House": function() {
		if (can_saffronGym()) {
			return hidden_logic();
		}
	},
	"Event_Mr_Psychic": function() {
		return can_saffron();
	},
	// Saffron Gym
	"EVENT_DEFEAT_SABRINA": function() {
		return can_saffronGym();
	},
	"Badge_Saffron_Gym": function() {
		return can_saffronGym();
	},
	"Event_Saffron_Gym": function() {
		return can_saffronGym();
	},
	// Fuchsia City
	"Rod_Fuchsia_City_Fishing_Brother": function() {
		return can_fuchsia();
	},
	// Warden's House
	"Event_Warden": function() {
		if (has("Gold_Teeth")) {
			return can_fuchsia();
		}
	},
	"Missable_Wardens_House_Item": function() {
		if (can_strength()) {
			return can_fuchsia();
		}
	},
	// Fuchsia Gym
	"EVENT_DEFEAT_KOGA": function() {
		return can_fuchsia();
	},
	"Badge_Fuchsia_Gym": function() {
		return can_fuchsia();
	},
	"Event_Fuschia_Gym": function() {
		return can_fuchsia();
	},
	// Safari Zone
	"Missable_Safari_Zone_Center_Item": function() {
		if (can_surf()) {
			return can_fuchsia();
		}
	},
	"Missable_Safari_Zone_East_Item_3": function() {
		return can_fuchsia();
	},
	"Missable_Safari_Zone_East_Item_4": function() {
		return can_fuchsia();
	},
	"Missable_Safari_Zone_East_Item_2": function() {
		return can_fuchsia();
	},
	"Missable_Safari_Zone_East_Item_1": function() {
		return can_fuchsia();
	},
	"Missable_Safari_Zone_West_Item_3": function() {
		return can_fuchsia();
	},
	"Missable_Safari_Zone_West_Item_1": function() {
		return can_fuchsia();
	},
	"Missable_Safari_Zone_North_Item_2": function() {
		return can_fuchsia();
	},
	"Missable_Safari_Zone_North_Item_1": function() {
		return can_fuchsia();
	},
	"Missable_Safari_Zone_West_Item_4": function() {
		return can_fuchsia();
	},
	"Missable_Safari_Zone_West_Item_2": function() {
		return can_fuchsia();
	},
	"Hidden_Item_Safari_Zone_West": function() {
		return can_fuchsiaHidden();
	},
	"Event_Safari_Zone_Secret_House": function() {
		return can_fuchsia();
	},
	// Cinnabar
	"Event_Lab_Scientist": function() {
		return can_cinnabar();
	},
	"Npc_Fossil_B": function() {
		if (has("EVENT_FOSSIL_A")) {
			return can_fossils();
		}
	},
	// Cinnabar Gym
	"EVENT_DEFEAT_BLAINE": function() {
		if (can_cinnabar() && has("Secret_Key")) {
			return "logical";
		}
	},
	"Badge_Cinnabar_Gym": function() {
		if (can_cinnabar() && has("Secret_Key")) {
			return "logical";
		}
	},
	"Event_Cinnabar_Gym": function() {
		if (can_cinnabar() && has("Secret_Key")) {
			return "logical";
		}
	},
	// Pokemon Mansion
	"Hidden_Item_Pokemon_Mansion_1F": function() {
		if (can_cinnabar()) {
			return hidden_logic();
		}
	},
	"Missable_Pokemon_Mansion_1F_Item_1": function() {
		return can_cinnabar();
	},
	"Missable_Pokemon_Mansion_3F_Item_1": function() {
		return can_cinnabar();
	},
	"Hidden_Item_Pokemon_Mansion_3F": function() {
		if (can_cinnabar()) {
			return hidden_logic();
		}
	},
	"Missable_Pokemon_Mansion_2F_Item": function() {
		return can_cinnabar();
	},
	"Missable_Pokemon_Mansion_3F_Item_2": function() {
		return can_cinnabar();
	},
	"Missable_Pokemon_Mansion_1F_Item_2": function() {
		return can_cinnabar();
	},
	"Missable_Pokemon_Mansion_B1F_Item_3": function() {
		return can_cinnabar();
	},
	"Missable_Pokemon_Mansion_B1F_Item_2": function() {
		return can_cinnabar();
	},
	"Missable_Pokemon_Mansion_B1F_Item_1": function() {
		return can_cinnabar();
	},
	"Missable_Pokemon_Mansion_B1F_Item_4": function() {
		return can_cinnabar();
	},
	"Hidden_Item_Pokemon_Mansion_B1F": function() {
		if (can_cinnabar()) {
			return hidden_logic();
		}
	},
	"Missable_Pokemon_Mansion_B1F_Item_5": function() {
		return can_cinnabar();
	},

	// ////////////////////
	// Routes
	// ////////////////////
	// 1
	"Event_Free_Sample": function() {
		return "logical";
	},
	// 2
	"Event_Route_2_Oaks_Aide": function() {
		if (can_cut() && has("Pokedex")) {
			return "logical";
		}
	},
	"Missable_Route_2_Item_1": function() {
		return can_cut();
	},
	"Missable_Route_2_Item_2": function() {
		return can_cut();
	},
	// Viridian Forest
	"Hidden_Item_Viridian_Forest_2": function() {
		if (can_pewter()) {
			return hidden_logic();
		}
	},
	"Missable_Viridian_Forest_Item_3": function() {
		return can_pewter();
	},
	"Missable_Viridian_Forest_Item_1": function() {
		return can_pewter();
	},
	"Missable_Viridian_Forest_Item_2": function() {
		return can_pewter();
	},
	"Hidden_Item_Viridian_Forest_1": function() {
		if (can_pewter()) {
			return hidden_logic();
		}
	},
	// 4
	// Mt. Moon
	"Missable_Mt_Moon_1F_Item_1": function() {
		return can_route3();
	},
	"Missable_Mt_Moon_1F_Item_2": function() {
		return can_route3();
	},
	"Missable_Mt_Moon_B2F_Item_1": function() {
		return can_route3();
	},
	"Missable_Mt_Moon_1F_Item_3": function() {
		return can_route3();
	},
	"Missable_Mt_Moon_1F_Item_4": function() {
		return can_route3();
	},
	"Missable_Mt_Moon_1F_Item_5": function() {
		return can_route3();
	},
	"Missable_Mt_Moon_B2F_Item_2": function() {
		return can_route3();
	},
	"Hidden_Item_MtMoonB2F_2": function() {
		if (can_route3()) {
			return hidden_logic();
		}
	},
	"Missable_Mt_Moon_1F_Item_6": function() {
		return can_route3();
	},
	"Hidden_Item_MtMoonB2F_1": function() {
		if (can_route3()) {
			return hidden_logic();
		}
	},
	"Npc_Fossil_A": function() {
		if (can_route3()) {
			if (can_fossils()) {
				return "logical";
			}
			return "possible";
		}
	},
	"EVENT_FOSSIL_A": function() {
		if (can_route3()) {
			if (can_fossils()) {
				return "logical";
			}
			return "possible";
		}
	},
	"Missable_Route_4_Item": function() {
		return can_route3();
	},
	"Hidden_Item_Route_4": function() {
		if (can_route3()) {
			return hidden_logic();
		}
	},
	// 5
	"Hidden_Item_Underground_Path_NS_1": function() {
		if (can_vermilion()) {
			return hidden_logic();
		}
	},
	"Hidden_Item_Underground_Path_NS_2": function() {
		if (can_vermilion()) {
			return hidden_logic();
		}
	},
	// 8
	"Hidden_Item_Underground_Path_WE_2": function() {
		return can_celadonHidden();
	},
	"Hidden_Item_Underground_Path_WE_1": function() {
		return can_celadonHidden();
	},
	// 9
	"Missable_Route_9_Item": function() {
		return can_route9();
	},
	"Hidden_Item_Route_9": function() {
		return can_route9Hidden();
	},
	// 10
	// Power Plant
	"Missable_Power_Plant_Item_1": function() {
		if (can_surf()) {
			return can_route9();
		}
	},
	"Hidden_Item_Power_Plant_1": function() {
		if (can_surf()) {
			return can_route9Hidden();
		}
	},
	"Missable_Power_Plant_Item_5": function() {
		if (can_surf()) {
			return can_route9();
		}
	},
	"Missable_Power_Plant_Item_4": function() {
		if (can_surf()) {
			return can_route9();
		}
	},
	"Missable_Power_Plant_Item_3": function() {
		if (can_surf()) {
			return can_route9();
		}
	},
	"Missable_Power_Plant_Item_2": function() {
		if (can_surf()) {
			return can_route9();
		}
	},
	"Hidden_Item_Power_Plant_2": function() {
		if (can_surf()) {
			return can_route9Hidden();
		}
	},
	"Hidden_Item_Route_10_1": function() {
		return can_route9Hidden();
	},
	"Hidden_Item_Route_10_2": function() {
		return can_celadonHidden();
	},
	// 11
	"Event_Rt11_Oaks_Aide": function() {
		if (can_vermilion() && has("Pokedex")) {
			return "logical";
		}
	},
	"Hidden_Item_Route_11": function() {
		if (can_vermilion()) {
			return hidden_logic();
		}
	},
	// 12
	"Rod_Route12_Fishing_Brother": function() {
		return can_fuchsia();
	},
	"Event_Mourning_Girl": function() {
		return can_lavender();
	},
	"Missable_Route_12_Item_1": function() {
		if (can_surf()) {
			return can_lavender();
		}
	},
	"Missable_Route_12_Item_2": function() {
		if (can_cut()) {
			return can_fuchsia();
		}
	},
	"Hidden_Item_Route_12": function() {
		if (can_vermilion()) {
			return hidden_logic();
		}
	},
	// 13
	"Hidden_Item_Route_13_1": function() {
		return can_fuchsiaHidden();
	},
	"Hidden_Item_Route_13_2": function() {
		return can_fuchsiaHidden();
	},
	// 15
	"Event_Rt_15_Oaks_Aide": function() {
		if (has("Pokedex")) {
			return can_fuchsia();
		}
	},
	"Missable_Route_15_Item": function() {
		if (can_cut()) {
			return can_fuchsia();
		}
	},
	// 16
	"Event_Rt16_House_Woman": function() {
		if (can_cut()) {
			return can_celadon();
		}
	},
	// 17
	"Hidden_Item_Route_17_1": function() {
		if (has("Bicycle")) {
			return can_fuchsiaHidden();
		}
	},
	"Hidden_Item_Route_17_2": function() {
		if (has("Bicycle")) {
			return can_fuchsiaHidden();
		}
	},
	"Hidden_Item_Route_17_3": function() {
		if (has("Bicycle")) {
			return can_fuchsiaHidden();
		}
	},
	"Hidden_Item_Route_17_4": function() {
		if (has("Bicycle")) {
			return can_fuchsiaHidden();
		}
	},
	"Hidden_Item_Route_17_5": function() {
		if (has("Bicycle")) {
			return can_fuchsiaHidden();
		}
	},
	// 20
	// Seafoam Islands
	"Hidden_Item_Seafoam_Islands_B2F": function() {
		if (can_surf()) {
			return hidden_logic();
		}
	},
	"Hidden_Item_Seafoam_Islands_B3F": function() {
		if (can_surf()) {
			return hidden_logic();
		}
	},
	"Hidden_Item_Seafoam_Islands_B4F": function() {
		if (can_surf()) {
			return hidden_logic();
		}
	},
	// 23
	// Victory Road
	"Missable_Victory_Road_1F_Item_1": function() {
		return can_vitoryRoadComplete();
	},
	"Missable_Victory_Road_1F_Item_2": function() {
		return can_vitoryRoadComplete();
	},
	"Missable_Victory_Road_2F_Item_1": function() {
		return can_vitoryRoadComplete();
	},
	"Missable_Victory_Road_2F_Item_2": function() {
		return can_vitoryRoadComplete();
	},
	"Missable_Victory_Road_2F_Item_3": function() {
		return can_vitoryRoadComplete();
	},
	"Missable_Victory_Road_3F_Item_1": function() {
		return can_vitoryRoadComplete();
	},
	"Missable_Victory_Road_3F_Item_2": function() {
		return can_vitoryRoadComplete();
	},
	"Hidden_Item_Victory_Road_2F_1": function() {
		if (can_vitoryRoadComplete()) {
			return hidden_logic();
		}
	},
	"Missable_Victory_Road_2F_Item_4": function() {
		return can_vitoryRoadComplete();
	},
	"Hidden_Item_Victory_Road_2F_2": function() {
		return can_vitoryRoadComplete();
	},
	"Hidden_Item_Route_23_1": function() {
		if (can_route23South() && can_surf()) {
			return hidden_logic();
		}
	},
	"Hidden_Item_Route_23_2": function() {
		if (can_route23South() && can_surf()) {
			return hidden_logic();
		}
	},
	"Hidden_Item_Route_23_3": function() {
		if (can_route23South() && can_surf()) {
			return hidden_logic();
		}
	},
	// 24
	"Event_Nugget_Bridge": function() {
		return can_cerulean();
	},
	"Missable_Route_24_Item": function() {
		return can_cerulean();
	},
	// 25
	// Bill's House
	"EVENT_RESCUE_BILL": function() {
		return can_cerulean();
	},
	"Event_Bill": function() {
		return can_cerulean();
	},
	"Missable_Route_25_Item": function() {
		if (can_cerulean()) {
			if (can_cut()) {
				return "logical";
			}
			return "possible";
		}
	},
	"Hidden_Item_Route_25_1": function() {
		if (can_cerulean()) {
			return hidden_logic();
		}
	},
	"Hidden_Item_Route_25_2": function() {
		if (can_cerulean()) {
			return hidden_logic();
		}
	},
	"EVENT_CHAMPION": function() {
		return can_e4();
	}
}