import TAManager from "./TAManager";
import index from "../index";

import beatsaver from "../beatsaverApi";
import fs from "fs";

type infoFile = {
	players: player[];
	bsr: string;
	watch: boolean;
	streams: boolean;
	taip: {
		ip: string;
		password: string;
	};
};

type player = {
	id: string;
	twitch: string;
};

var manager: TAManager;

function connectToTA(opts: infoFile) {
	manager = new TAManager(opts.taip.ip);
	listenForSongLoads();
}

function listenForSongLoads() {
	manager.on("song-load", (e) => {
		if (!e.SelectedLevel.LevelId.includes("custom_level_")) return;
		console.log("Song Loaded From TA: Downloading.");
		getbsfromhash(e.SelectedLevel.LevelId.replace("custom_level_", ""));
	});
}

// Map
async function getbsfromhash(bsr: string) {
	var map_data = await beatsaver.getMapFromHash(bsr);
	if (map_data) {
		var map_img = await beatsaver.getCover(map_data);
		index.keepDir("data\\song\\");

		fs.writeFileSync(`${__dirname}\\..\\data\\song\\song_img.png`, map_img, { encoding: "binary" });
		index.saveFile("song\\song_map_name.txt", map_data.name);
		index.saveFile("song\\song_map_mapper.txt", map_data.uploader.username);
		index.saveFile("song\\song_map_code.txt", map_data.key);
	}
}

export default {
	connectToTA,
};
