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
	if (has("Cascade_Badge") || getSettingValue(badges_needed_for_hm_moves)) {
		return has("HM01_Cut");
	}
}
function can_flash() {
	if (!getSettingValue(dark_rock_tunnel_logic)) {
		return "logical";
	}
	if ((has("Boulder_Badge") || getSettingValue(badges_needed_for_hm_moves)) && has("HM05_Flash")) {
		return "logical";
	}
	return "possible";
}
function can_strength() {
	if (has("Rainbow_Badge") || getSettingValue(badges_needed_for_hm_moves)) {
		return has("HM04_Strength");
	}
}
function can_surf() {
	if (has("Soul_Badge") || getSettingValue(badges_needed_for_hm_moves)) {
		return has("HM03_Surf");
	}
}
function hidden_logic() {
	if (has("Item_Finder")) {
		return "logical";
	}
	if (!getSettingValue(require_item_finder)) {
		return "possible";
	}
}
function can_areaHidden(area) {
	const hiddenable = hidden_logic();
	if (!area || !hiddenable) {
		return;
	}
	if (area === "possible" || hiddenable === "possible") {
		return "possible"
	}
	return "logical";
}
// Logic Helpers
function can_bike() {
	if (!getSettingValue(bicycle_gate_skips)) {
		return has("Bicycle");
	}
	return "logical";
}
function can_oaks_aid() {
	if (getSettingValue(require_pokedex)) {
		return has("Pokedex");
	}
	return "logical";
}
function can_extra_strength() {
	if (getSettingValue(extra_strength_boulders)) {
		return can_strength();
	}
	return "logical";
}
function can_fuchsia_from_seafoam() {
	if (can_surf()) {
		return can_strength();
	}
}
function can_route2_from_viridian() {
	if (!getSettingValue(old_man)) {
		return has("EVENT_RETURN_PARCEL");
	}
	return "logical";
}
function can_route3_from_pewter() {
	const r3id = getSettingValue(route_3_condition);
	if (r3id === 0) {
		return "logical";
	}
	else if (r3id === 1) {
		return has("EVENT_DEFEAT_BROCK");
	}
	else if (r3id === 2 && count_gyms() > 0) {
		return "logical";;
	}
	else if (r3id === 3) {
		return has("Boulder_Badge");
	}
	else if (r3id === 4 && count_badges() > 0) {
		return "logical";;
	}
}
function can_route5_from_cerulean() {
	if (getSettingValue(robbed_house_officer)) {
		return has("EVENT_RESCUE_BILL");
	}
	return "logical";
}
function can_plot_to_cerulean() {
	if (can_route2_from_viridian()) {
		return can_route3_from_pewter();
	}
}
function can_plot_to_vermilion() {
	if (can_plot_to_cerulean()) {
		return can_route5_from_cerulean();
	}
}
function can_tea() {
	if (getSettingValue(tea)) {
		return has("Tea");
	}
	// can navigate to Celadon
	// From Pallet-Cinnabar-Fuchsia-Lavender-Celadon
	if (can_fuchsia_from_seafoam()) {
		return "logical";
	}
	// From Pallet-Viridian-Vermilion
	if (can_plot_to_vermilion()) {
		if (can_extra_strength() && has("Poke_Flute")) {
			return "logical";
		}
	}
	// From Pallet-Viridian-Pewter-Cerulean-Vermilion
	if (can_cut()) {
		//-Lavender-Celadon
		if (can_extra_strength() && has("Poke_Flute")) {
			return "logical";
		}
		//-Cerulean-Lavender-Celadon
		return can_flash();
	}
}

// Town Logic
// Pallet - logical
// Viridian - logical
function can_viridianGym() {
	if (count_badges() >= getSettingValue(viridian_gym_condition)) {
		return can_pewter();
	}
}
function can_pewter() {
	// From Pallet-Viridian
	if (can_cut()) {
		return "logical";
	}
	if (can_route2_from_viridian()) {
		return "logical";
	}
	// From Pallet-Cinibar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		//-Vermilion-Cerulean
		if (has("Poke_Flute")) {
			return "logical";
		}
		//-Lavender-Saffron-Cerulean
		return can_tea();
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
		return can_tea();
	}
}
function can_ceruleanCave() {
	if (can_surf() && count_badges() >= getSettingValue(cerulean_cave_badges_condition)) {
		return can_cerulean();
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
		return can_tea();
	}
}
function can_ssAnne() {
	if (can_vermilion()) {
		return has("SS_Ticket");
	}
}
function can_lavender() {
	// From Pallet-Cinnabar-Fuchsia
	if (can_fuchsia_from_seafoam()) {
		return "logical";
	}
	let optionA = false;
	let optionB = false;
	// From Pallet-Viridian-Pewter-Cerulean
	if (can_plot_to_vermilion() || can_cut()) {
		//-Vermilion
		if (can_extra_strength() && has("Poke_Flute")) {
			return "logical";
		}
		//-Saffron
		optionA = can_tea();
		if (optionA === "logical") {
			return "logical";
		}
	}
	// From Pallet-Viridian-Vermilion
	if (can_cut()) {
		//-Cerulean
		optionB = can_flash();
		if (optionB === "logical") {
			return "logical";
		}
	}
	if (optionA || optionB) {
		return "possible";
	}
}
function can_celadon() {
	// No requirements between these two towns.
	return can_lavender();
}
function can_hideout() {
	if (has("Hideout_Key") || !getSettingValue(extra_key_items)) {
		return can_celadon();
	}
}
function can_saffron() {
	// From Pallet-Viridian-Vermilion
	// From Pallet-Viridian-Pewter-Cerulean
	// From Pallet-Cinnabar-Fuchsia-Lavender
	if (can_cut() || can_plot_to_vermilion() || can_fuchsia_from_seafoam()) {
		// Always need tea
		return can_tea();
	}
}
function can_silph() {
	if (has("EVENT_RESCUE_FUJI")) {
		return can_saffron();
	}
}
function can_silphCardKey(floor) {
	if (!getSettingValue(split_card_key)) {
		return has("Card_Key");
	}
	return has("Card_Key_" + floor + "F");
}
function can_saffronGym() {
	if (has("EVENT_FREE_SILPH")) {
		return can_saffron();
	}
}
function can_fuchsia() {
	// From Pallet-Cinnabar
	if (can_fuchsia_from_seafoam()) {
		return "logical";
	}
	let optionA = false;
	let optionB = false;
	// From Pallet-Viridian-Vermilion
	// From Pallet-Viridian-Pewter-Cerulean-Vermilion
	if (can_cut() || can_plot_to_vermilion()) {
		if (has("Poke_Flute") && can_extra_strength()) {
			return "logical";
		}
		//-Saffron
		if (can_surf() || (can_bike() && has("Poke_Flute"))) {
			optionA = can_tea();
			if (optionA === "logical") {
				return "logical";
			}
		}
	}
	// From Pallet-Viridian-Pewter-Cerulean-Lavender-Celadon
	if (can_cut() && can_bike() && has("Poke_Flute")) {
		optionB = can_flash();
		if (optionB === "logical") {
			return "logical";
		}
	}
	if (optionA || optionB) {
		return "possible";
	}
}
function can_safari() {
	if (has("Safari_Pass") || !getSettingValue(extra_key_items)) {
		return can_fuchsia();
	}
}
function can_cinnabar() {
	return can_surf();
}
function can_fossils() {
	if (count_fossils() >= getSettingValue(second_fossil_check_condition)) {
		return can_cinnabar();
	}
}
function can_mansion() {
	if (has("Mansion_Key") || !getSettingValue(extra_key_items)) {
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
		if (can_route2_from_viridian()) {
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
		return can_tea();
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
		return can_flash();
	}
}
// 10 North - can_route9()
// 10 Power Plant
function can_plant() {
	if ((has("Plant_Key") || !getSettingValue(extra_key_items)) && can_surf()) {
		return can_route9();
	}
}
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
	if (count_badges() >= getSettingValue(route_22_gate_condition)) {
		return "logical";
	}
}
function can_victoryRoad() {
	if (can_route23South() && count_badges() >= getSettingValue(victory_road_condition)) {
		return can_surf();
	}
}
function can_victoryRoadComplete() {
	if (can_victoryRoad()) {
		return can_strength();
	}
}
function can_e4() {
	if (count_badges() >= getSettingValue(elite_four_badges_condition)) {
		return can_victoryRoadComplete();
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
		return can_areaHidden(can_ceruleanCave());
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
		return can_areaHidden(can_ceruleanCave());
	},
	"Hidden_Item_Cerulean_City": function() {
		return can_areaHidden(can_ceruleanCave());
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
		if (can_surf() || can_cut()) {
			return can_vermilion();
		}
	},
	"Badge_Vermilion_Gym": function() {
		if (can_surf() || can_cut()) {
			return can_vermilion();
		}
	},
	"Event_Vermillion_Gym": function() {
		if (can_surf() || can_cut()) {
			return can_vermilion();
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
		return can_areaHidden(can_ssAnne());
	},
	"Missable_SS_Anne_1F_Item": function() {
		return can_ssAnne();
	},
	"Hidden_Item_SS_Anne_Kitchen": function() {
		return can_areaHidden(can_ssAnne());
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
		return can_areaHidden(can_vermilion());
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
		return can_areaHidden(can_lavender());
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
		if (has("Silph_Scope") || getSettingValue(poke_doll_skip)) {
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
			return can_areaHidden(can_celadon());
		}
	},
	"Hidden_Item_Game_Corner_2": function() {
		if (has("Coin_Case")) {
			return can_areaHidden(can_celadon());
		}
	},
	"Hidden_Item_Game_Corner_3": function() {
		if (has("Coin_Case")) {
			return can_areaHidden(can_celadon());
		}
	},
	"Hidden_Item_Game_Corner_4": function() {
		if (has("Coin_Case")) {
			return can_areaHidden(can_celadon());
		}
	},
	"Hidden_Item_Game_Corner_5": function() {
		if (has("Coin_Case")) {
			return can_areaHidden(can_celadon());
		}
	},
	"Hidden_Item_Game_Corner_6": function() {
		if (has("Coin_Case")) {
			return can_areaHidden(can_celadon());
		}
	},
	"Hidden_Item_Game_Corner_7": function() {
		if (has("Coin_Case")) {
			return can_areaHidden(can_celadon());
		}
	},
	"Hidden_Item_Game_Corner_8": function() {
		if (has("Coin_Case")) {
			return can_areaHidden(can_celadon());
		}
	},
	"Hidden_Item_Game_Corner_9": function() {
		if (has("Coin_Case")) {
			return can_areaHidden(can_celadon());
		}
	},
	"Hidden_Item_Game_Corner_10": function() {
		if (has("Coin_Case")) {
			return can_areaHidden(can_celadon());
		}
	},
	"Hidden_Item_Game_Corner_11": function() {
		if (has("Coin_Case")) {
			return can_areaHidden(can_celadon());
		}
	},
	"Prize_Item_A": function() {
		if (has("Coin_Case")) {
			return can_celadon();
		}
	},
	"Prize_Item_B": function() {
		if (has("Coin_Case")) {
			return can_celadon();
		}
	},
	"Prize_Item_C": function() {
		if (has("Coin_Case")) {
			return can_celadon();
		}
	},
	// Rocket Hideout
	"Hidden_Item_Rocket_Hideout_B1F": function() {
		return can_areaHidden(can_hideout());
	},
	"Missable_Rocket_Hideout_B1F_Item_1": function() {
		return can_hideout();
	},
	"Missable_Rocket_Hideout_B3F_Item_1": function() {
		return can_hideout();
	},
	"Hidden_Item_Rocket_Hideout_B3F": function() {
		return can_areaHidden(can_hideout());
	},
	"Missable_Rocket_Hideout_B3F_Item_2": function() {
		return can_hideout();
	},
	"Missable_Rocket_Hideout_B4F_Item_1": function() {
		return can_hideout();
	},
	"Missable_Rocket_Hideout_B4F_Item_2": function() {
		return can_hideout();
	},
	"Missable_Rocket_Hideout_B4F_Item_5": function() {
		return can_hideout();
	},
	"Missable_Rocket_Hideout_B2F_Item_2": function() {
		return can_hideout();
	},
	"Missable_Rocket_Hideout_B2F_Item_1": function() {
		return can_hideout();
	},
	"Missable_Rocket_Hideout_B2F_Item_3": function() {
		return can_hideout();
	},
	"Missable_Rocket_Hideout_B2F_Item_4": function() {
		return can_hideout();
	},
	"Missable_Rocket_Hideout_B1F_Item_2": function() {
		return can_hideout();
	},
	"Missable_Rocket_Hideout_B4F_Item_3": function() {
		if (has("Lift_Key")) {
			return can_hideout();
		}
	},
	"Missable_Rocket_Hideout_B4F_Item_4": function() {
		if (has("Lift_Key")) {
			return can_hideout();
		}
	},
	"Hidden_Item_Rocket_Hideout_B4F": function() {
		if (has("Lift_Key")) {
			return can_areaHidden(can_hideout());
		}
	},
	"Hidden_Item_Celadon_City": function() {
		return can_areaHidden(can_celadon());
	},
	// Saffron
	// Silph Co
	"Event_SKC1F": function() {
		if (has("EVENT_FREE_SILPH")) {
			return can_silph();
		}
	},
	"Event_Scared_Woman": function() {
		if (can_silphCardKey(2)) {
			return can_silph();
		}
	},
	"Missable_Silph_Co_3F_Item": function() {
		if (can_silphCardKey(3) || can_silphCardKey(9)) {
			return can_silph();
		}
	},
	"Missable_Silph_Co_4F_Item_1": function() {
		if (can_silphCardKey(4)) {
			return can_silph();
		}
	},
	"Missable_Silph_Co_4F_Item_2": function() {
		if (can_silphCardKey(4)) {
			return can_silph();
		}
	},
	"Missable_Silph_Co_4F_Item_3": function() {
		if (can_silphCardKey(4)) {
			return can_silph();
		}
	},
	"Event_SKC4F": function() {
		return can_silph();
	},
	"Hidden_Item_Silph_Co_5F": function() {
		return can_areaHidden(can_silph());
	},
	"Missable_Silph_Co_5F_Item_1": function() {
		if (can_silphCardKey(5)) {
			return can_silph();
		}
	},
	"Missable_Silph_Co_5F_Item_2": function() {
		return can_silph();
	},
	"Missable_Silph_Co_5F_Item_3": function() {
		return can_silph();
	},
	"Event_SKC5F": function() {
		if (can_silphCardKey(5)) {
			return can_silph();
		}
	},
	"Missable_Silph_Co_6F_Item_1": function() {
		if (can_silphCardKey(6)) {
			return can_silph();
		}
	},
	"Missable_Silph_Co_6F_Item_2": function() {
		if (can_silphCardKey(6)) {
			return can_silph();
		}
	},
	"Event_SKC6F": function() {
		return can_silph();
	},
	"Missable_Silph_Co_7F_Item_1": function() {
		return can_silph();
	},
	"Missable_Silph_Co_7F_Item_2": function() {
		if (can_silphCardKey(7)) {
			return can_silph();
		}
	},
	"Event_SKC7F": function() {
		if (can_silphCardKey(7)) {
			return can_silph();
		}
	},
	"Event_SKC8F": function() {
		return can_silph();
	},
	"Hidden_Item_Silph_Co_9F": function() {
		if (can_silphCardKey(9)) {
			return can_areaHidden(can_silph());
		}
	},
	"Event_SKC9F": function() {
		return can_silph();
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
	"Event_SKC10F": function() {
		return can_silph();
	},
	"Event_SKC11F": function() {
		return can_silph();
	},
	"EVENT_FREE_SILPH": function() {
		if (can_silphCardKey(11) && can_silphCardKey(3)) {
			return can_silph();
		}
	},
	"Event_Silph_Co_President": function() {
		if (can_silphCardKey(11) && can_silphCardKey(3)) {
			return can_silph();
		}
	},
	// Copycat's House
	"Event_Copycat": function() {
		return can_saffronGym();
	},
	"Hidden_Item_Copycats_House": function() {
		return can_areaHidden(can_saffronGym());
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
			return can_safari();
		}
	},
	"Missable_Safari_Zone_East_Item_3": function() {
		return can_safari();
	},
	"Missable_Safari_Zone_East_Item_4": function() {
		return can_safari();
	},
	"Missable_Safari_Zone_East_Item_2": function() {
		return can_safari();
	},
	"Missable_Safari_Zone_East_Item_1": function() {
		return can_safari();
	},
	"Missable_Safari_Zone_West_Item_3": function() {
		return can_safari();
	},
	"Missable_Safari_Zone_West_Item_1": function() {
		return can_safari();
	},
	"Missable_Safari_Zone_North_Item_2": function() {
		return can_safari();
	},
	"Missable_Safari_Zone_North_Item_1": function() {
		return can_safari();
	},
	"Missable_Safari_Zone_West_Item_4": function() {
		return can_safari();
	},
	"Missable_Safari_Zone_West_Item_2": function() {
		return can_safari();
	},
	"Hidden_Item_Safari_Zone_West": function() {
		return can_areaHidden(can_safari());
	},
	"Event_Safari_Zone_Secret_House": function() {
		return can_safari();
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
		if (has("Secret_Key")) {
			return can_cinnabar();
		}
	},
	"Badge_Cinnabar_Gym": function() {
		if (has("Secret_Key")) {
			return can_cinnabar();
		}
	},
	"Event_Cinnabar_Gym": function() {
		if (has("Secret_Key")) {
			return can_cinnabar();
		}
	},
	// Pokemon Mansion
	"Hidden_Item_Pokemon_Mansion_1F": function() {
		return can_areaHidden(can_mansion());
	},
	"Missable_Pokemon_Mansion_1F_Item_1": function() {
		return can_mansion();
	},
	"Missable_Pokemon_Mansion_3F_Item_1": function() {
		return can_mansion();
	},
	"Hidden_Item_Pokemon_Mansion_3F": function() {
		return can_areaHidden(can_mansion());
	},
	"Missable_Pokemon_Mansion_2F_Item": function() {
		return can_mansion();
	},
	"Missable_Pokemon_Mansion_3F_Item_2": function() {
		return can_mansion();
	},
	"Missable_Pokemon_Mansion_1F_Item_2": function() {
		return can_mansion();
	},
	"Missable_Pokemon_Mansion_B1F_Item_3": function() {
		return can_mansion();
	},
	"Missable_Pokemon_Mansion_B1F_Item_2": function() {
		return can_mansion();
	},
	"Missable_Pokemon_Mansion_B1F_Item_1": function() {
		return can_mansion();
	},
	"Missable_Pokemon_Mansion_B1F_Item_4": function() {
		return can_mansion();
	},
	"Hidden_Item_Pokemon_Mansion_B1F": function() {
		return can_areaHidden(can_mansion());
	},
	"Missable_Pokemon_Mansion_B1F_Item_5": function() {
		return can_mansion();
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
		if (can_cut()) {
			return can_oaks_aid();
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
		return can_areaHidden(can_pewter());
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
		return can_areaHidden(can_pewter());
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
		return can_areaHidden(can_route3());
	},
	"Missable_Mt_Moon_1F_Item_6": function() {
		return can_route3();
	},
	"Hidden_Item_MtMoonB2F_1": function() {
		return can_areaHidden(can_route3());
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
		return can_route3();
	},
	"Missable_Route_4_Item": function() {
		return can_route3();
	},
	"Hidden_Item_Route_4": function() {
		return can_areaHidden(can_route3());
	},
	// 5
	"Hidden_Item_Underground_Path_NS_1": function() {
		return can_areaHidden(can_vermilion());
	},
	"Hidden_Item_Underground_Path_NS_2": function() {
		return can_areaHidden(can_vermilion());
	},
	// 8
	"Hidden_Item_Underground_Path_WE_2": function() {
		return can_areaHidden(can_celadon());
	},
	"Hidden_Item_Underground_Path_WE_1": function() {
		return can_areaHidden(can_celadon());
	},
	// 9
	"Missable_Route_9_Item": function() {
		return can_route9();
	},
	"Hidden_Item_Route_9": function() {
		return can_areaHidden(can_route9());
	},
	// 10
	// Power Plant
	"Missable_Power_Plant_Item_1": function() {
		return can_plant();
	},
	"Hidden_Item_Power_Plant_1": function() {
		return can_areaHidden(can_plant());
	},
	"Missable_Power_Plant_Item_5": function() {
		return can_plant();
	},
	"Missable_Power_Plant_Item_4": function() {
		return can_plant();
	},
	"Missable_Power_Plant_Item_3": function() {
		return can_plant();
	},
	"Missable_Power_Plant_Item_2": function() {
		return can_plant();
	},
	"Hidden_Item_Power_Plant_2": function() {
		return can_areaHidden(can_plant());
	},
	"Hidden_Item_Route_10_1": function() {
		return can_areaHidden(can_route9());
	},
	// Rock Tunnel
	"Missable_Rock_Tunnel_B1F_Item_1": function() {
		if (can_lavender()) {
			return can_flash();
		}
	},
	"Missable_Rock_Tunnel_B1F_Item_2": function() {
		if (can_lavender()) {
			return can_flash();
		}
	},
	"Missable_Rock_Tunnel_B1F_Item_3": function() {
		if (can_lavender()) {
			return can_flash();
		}
	},
	"Missable_Rock_Tunnel_B1F_Item_4": function() {
		if (can_lavender()) {
			return can_flash();
		}
	},
	"Hidden_Item_Route_10_2": function() {
		return can_areaHidden(can_lavender());
	},
	// 11
	"Event_Rt11_Oaks_Aide": function() {
		// Vermillion through the strength boulders
		if (can_vermilion() && can_extra_strength()) {
			return "logical";
		}
		// Lavender through the Snorlax
		if (has("Poke_Flute")) {
			return can_lavender();
		}
	},
	"Hidden_Item_Route_11": function() {
		return can_areaHidden(can_vermilion());
	},
	// 12
	"Rod_Route12_Fishing_Brother": function() {
		// Vermillion through the strength boulders n Snorlax
		if (can_vermilion() && can_extra_strength() && has("Poke_Flute")) {
			return "logical";
		}
		// Lavender through the Snorlax
		let optionA = false;
		if (has("Poke_Flute") || can_surf()) {
			optionA = can_lavender();
			if (optionA === "logical") {
				return "logical";
			}
		}
		// Fuschia through the strength boulders
		let optionB = false;
		if (can_extra_strength() || can_surf()) {
			optionB = can_fuchsia();
			if (optionB === "logical") {
				return "logical";
			}
		}
		if (optionA || optionB) {
			return "possible";
		}
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
			// Vermillion through the strength boulders n Snorlax
			if (can_extra_strength() && has("Poke_Flute")) {
				return "logical";
			}
			// Lavender through the Snorlax
			let optionA = false;
			if (has("Poke_Flute") || can_surf()) {
				optionA = can_lavender();
				if (optionA === "logical") {
					return "logical";
				}
			}
			// Fuschia through the strength boulders
			let optionB = false;
			if (can_extra_strength() || can_surf()) {
				optionB = can_fuchsia();
				if (optionB === "logical") {
					return "logical";
				}
			}
			if (optionA || optionB) {
				return "possible";
			}
		}
	},
	"Hidden_Item_Route_12": function() {
		// Vermillion through the strength boulders
		if (can_vermilion() && can_extra_strength()) {
			return hidden_logic();
		}
		// Lavender through the Snorlax
		if (has("Poke_Flute")) {
			return can_areaHidden(can_lavender());
		}
	},
	// 13
	"Hidden_Item_Route_13_1": function() {
		return can_areaHidden(can_fuchsia());
	},
	"Hidden_Item_Route_13_2": function() {
		return can_areaHidden(can_fuchsia());
	},
	// 15
	"Event_Rt_15_Oaks_Aide": function() {
		if (can_oaks_aid()) {
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
		if (can_bike()) {
			return can_areaHidden(can_fuchsia());
		}
	},
	"Hidden_Item_Route_17_2": function() {
		if (can_bike()) {
			return can_areaHidden(can_fuchsia());
		}
	},
	"Hidden_Item_Route_17_3": function() {
		if (can_bike()) {
			return can_areaHidden(can_fuchsia());
		}
	},
	"Hidden_Item_Route_17_4": function() {
		if (can_bike()) {
			return can_areaHidden(can_fuchsia());
		}
	},
	"Hidden_Item_Route_17_5": function() {
		if (can_bike()) {
			return can_areaHidden(can_fuchsia());
		}
	},
	// 20
	// Seafoam Islands
	"Hidden_Item_Seafoam_Islands_B2F": function() {
		return can_areaHidden(can_surf());
	},
	"Hidden_Item_Seafoam_Islands_B3F": function() {
		return can_areaHidden(can_surf());
	},
	"Hidden_Item_Seafoam_Islands_B4F": function() {
		return can_areaHidden(can_surf());
	},
	// 23
	// Victory Road
	"Missable_Victory_Road_1F_Item_1": function() {
		return can_victoryRoadComplete();
	},
	"Missable_Victory_Road_1F_Item_2": function() {
		return can_victoryRoadComplete();
	},
	"Missable_Victory_Road_2F_Item_1": function() {
		return can_victoryRoadComplete();
	},
	"Missable_Victory_Road_2F_Item_2": function() {
		return can_victoryRoadComplete();
	},
	"Missable_Victory_Road_2F_Item_3": function() {
		return can_victoryRoadComplete();
	},
	"Missable_Victory_Road_3F_Item_1": function() {
		return can_victoryRoadComplete();
	},
	"Missable_Victory_Road_3F_Item_2": function() {
		return can_victoryRoadComplete();
	},
	"Hidden_Item_Victory_Road_2F_1": function() {
		return can_areaHidden(can_victoryRoadComplete());
	},
	"Missable_Victory_Road_2F_Item_4": function() {
		return can_victoryRoadComplete();
	},
	"Hidden_Item_Victory_Road_2F_2": function() {
		return can_victoryRoadComplete();
	},
	"Hidden_Item_Route_23_1": function() {
		if (can_surf()) {
			return can_areaHidden(can_route23South());
		}
	},
	"Hidden_Item_Route_23_2": function() {
		if (can_surf()) {
			return can_areaHidden(can_route23South());
		}
	},
	"Hidden_Item_Route_23_3": function() {
		if (can_surf()) {
			return can_areaHidden(can_route23South());
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
		return can_areaHidden(can_cerulean());
	},
	"Hidden_Item_Route_25_2": function() {
		return can_areaHidden(can_cerulean());
	},
	"EVENT_CHAMPION": function() {
		return can_e4();
	}
}