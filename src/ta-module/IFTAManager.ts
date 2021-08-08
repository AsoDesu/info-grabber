import TAManager from "./TAManager";
import index from "../index";
import stream_manager from "../stream-module/backend";

import beatsaver from "../beatsaverApi";
import fs from "fs";
import path from "path";

import { infoFile, player } from "../Types";
import * as types from "./TATypes";

var manager: TAManager;

function connectToTA(opts: infoFile) {
	var ip: string;

	if (!opts.taip.ip.includes(":")) {
		console.log("\x1b[33mNo Overlay Port Specified, Using Default Port 10157");
		ip = `${opts.taip.ip}:10157`;
	} else {
		ip = opts.taip.ip;
	}

	manager = new TAManager(ip);
	listen();
}

function listen() {
	manager.on("err", () => {
		stream_manager.failedToConnect();
	});

	manager.on("song-load", async (e) => {
		if (!e.SelectedLevel.LevelId.includes("custom_level_")) return;
		console.log("\x1b[32mSong Loaded From TA: Downloading.");
		var map_data = await getbsfromhash(e.SelectedLevel.LevelId.replace("custom_level_", ""));

		var opts = index.opts;
		opts.song.bsr = map_data.id;
		stream_manager.streamUpdate(opts);
	});

	manager.on("state-change", (state: types.state) => {
		var info = index.opts;
		stream_manager.send(JSON.stringify(info));
	});
}

// Map
async function getbsfromhash(bsr: string) {
	var map_data = await beatsaver.getMapFromHash(bsr);
	if (map_data) {
		var map_img = await beatsaver.getCover(map_data);
		index.keepDir("data\\song\\");

		fs.writeFileSync(path.join(process.cwd(), `data\\song\\song_img.png`), map_img, { encoding: "binary" });
		index.saveFile("song\\song_map_name.txt", map_data.name);
		index.saveFile("song\\song_map_mapper.txt", map_data.uploader.name);
		index.saveFile("song\\song_map_code.txt", map_data.id);
	} else {
		stream_manager.failedToGetMap();
	}
	return map_data;
}

function getManager() {
	return manager;
}

export default {
	connectToTA,
	getManager,
};
