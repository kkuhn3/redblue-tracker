let aport = false;
let pname = false;

let idToString = {};
let idToItem = {};
let idToLocation = {};
let idToEvent = {};
// https://github.com/ArchipelagoMW/Archipelago/blob/main/worlds/pokemon_rb/locations.py
const offset = 172000000;
async function loadStaticContent() {
	const res1 = await fetch('./static/idToString.json', {
		method: 'GET'
	});
	idToString = await res1.json();
	const res2 = await fetch('./static/idToItem.json', {
		method: 'GET'
	});
	idToItem = await res2.json();
	const res3 = await fetch('./static/idToLocation.json', {
		method: 'GET'
	});
	idToLocation = await res3.json();
	const res4 = await fetch('./static/idToEvent.json', {
		method: 'GET'
	});
	idToEvent = await res4.json();
}

function connect() {
	if (!aport || !pname) {
		return;
	}
	socket = new WebSocket("wss://archipelago.gg:" + aport);

	socket.addEventListener('open', function (event) {
		socket.send(`[{
			"cmd" : "Connect",
			"password" : "",
			"game" : "Pokemon Red and Blue",
			"name" : "` + pname + `",
			"tags" : ["Tracker"],
			"version" : {
				"major": 0,
				"minor": 5,
				"build": 0,
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