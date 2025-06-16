let ahost = "archipelago.gg";
let aport = false;
let aname = false;
let apass = "";

// https://github.com/ArchipelagoMW/Archipelago/blob/main/worlds/pokemon_rb/locations.py
const offset = 172000000;

function connect() {
	if (!aport || !aname) {
		return;
	}
	socket = new WebSocket("wss://" + ahost + ":" + aport);

	socket.addEventListener('open', function (event) {
		socket.send(`[{
			"cmd" : "Connect",
			"password" : "` + apass + `",
			"game" : "Pokemon Red and Blue",
			"name" : "` + aname + `",
			"tags" : ["Tracker"],
			"version" : {
				"major": 0,
				"minor": 6,
				"build": 1,
				"class": "Version"
			},
			"items_handling" : 7,
			"uuid" : "a1c0aac5-01e5-4957-99fe-6ae9edeafa78"
		}]`);
	});

	let slot = -1;
	socket.addEventListener('message', function (event) {
		const message = JSON.parse(event.data);
		console.log(message);
		let commands = [];
		for (let command of message) {
			commands.push(command.cmd);
		}

		// seems to be an initial connect response
		if (commands.includes("Connected")) {
			for (let command of message) {
				if (command.cmd === "Connected") {
					slot = command.slot;
					// for each "checked_location"
					if (currentGroup) {
						groupBreakDown.innerHTML = "";
					}
					for (let location of command.checked_locations) {
						gotLocation(location);
					}
					if (currentGroup) {
						groupFocus(document.getElementById(currentGroup));
					}
					settingsFromSlotData(command.slot_data);
					updateLocations();
					updateGroups();
					countchecks();
				}
				// for each "ReceivedItems"
				else if (command.cmd === "ReceivedItems") {
					if (currentGroup) {
						groupBreakDown.innerHTML = "";
					}
					for (let item of command.items) {
						gotItem(item.item);
					}
					if (currentGroup) {
						groupFocus(document.getElementById(currentGroup));
					}
					updateLocations();
					updateGroups();
					countchecks();
				}
			}
		}
		// on the fly
		else if (commands.includes("PrintJSON")) {
			for (let command of message) {
				if (command.cmd === "PrintJSON" && command.type === "ItemSend") {
					if (currentGroup) {
						groupBreakDown.innerHTML = "";
					}
					//I checked the location
					if (command.item.player === slot) {
						gotLocation(command.item.location);
					}
					//I recieved the item
					if (command.receiving === slot) {
						gotItem(command.item.item);
					}
					if (currentGroup) {
						groupFocus(document.getElementById(currentGroup));
					}
					updateLocations();
					updateGroups();
					countchecks();
				}
			}
		}
	});
}

function gotItem(id) {
	let itemName = idToItem[id - offset];
	if (itemName) {
		addClassName(document.getElementById(itemName), "itemchecked")
	}
}

function gotLocation(id) {
	let locationName = idToLocation[id - offset];
	if (locationName) {
		let div = document.getElementById(locationName);
		if (div.classList.contains("sub")) {
			addClassName(document.getElementById(locationName), "subchecked");
		}
		else {
			addClassName(document.getElementById(locationName), "locationchecked");
		}
	}
	let eventName = idToEvent[id - offset];
	if (eventName) {
		let div = document.getElementById(eventName);

		// Special exception for fossils. Get one early, one later.
		if (eventName === "EVENT_FOSSIL_A") {
			if (div.classList.contains("subchecked")) {
				addClassName(document.getElementById("Npc_Fossil_B"), "subchecked");
			}
		}

		if (div.classList.contains("sub")) {
			addClassName(document.getElementById(eventName), "subchecked");
		}
		else {
			addClassName(document.getElementById(eventName), "locationchecked");
		}
	}
}

function settingsFromSlotData(slotData) {
	for (const setting of document.getElementsByClassName("setting")) {
		if (slotData[setting.id] != null) {
			setSettingClass(setting, "_" + slotData[setting.id]);
		}
	}
	// old_man
	if (getSettingValue(old_man) === 1) {
		setSettingClass(old_man, "_" + 0);
	}
	else if (getSettingValue(old_man) === 2) {
		setSettingClass(old_man, "_" + 1);
	}
	// badges_needed_for_hm_moves
	if (getSettingValue(badges_needed_for_hm_moves) === 2 || getSettingValue(badges_needed_for_hm_moves) === 3) {
		setSettingClass(badges_needed_for_hm_moves, "_" + 0);
	}
	// split_card_key
	if (getSettingValue(split_card_key) === 2) {
		setSettingClass(split_card_key, "_" + 1);
	}
	// randomize_hidden_items
	if (getSettingValue(randomize_hidden_items) === 2) {
		setSettingClass(randomize_hidden_items, "_" + 1);
	}

	hideToMatch();
}
