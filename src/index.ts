import scoresaber from "./scoresaberApiGrabber";
import beatsaver from "./beatsaverApi";
import ejs from "edit-json-file";
import fs from "fs";

import stream_module from "./stream-module/backend";
import IFTAManager from "./ta-module/IFTAManager";

const file = ejs(`${__dirname}/info.json`);

type infoFile = {
	players: player[];
	bsr: string;
	watch: boolean;
	streams: boolean;
	panel: boolean;
	taip: {
		ip: string;
		password: string;
	};
};

type player = {
	id: string;
	twitch: string;
};

var opts = file.read() as infoFile;
var update = true;

try {
	fs.readFileSync(`${__dirname}\\info.json`);
} catch {
	var defaultConfig = {
		players: [
			{
				id: "",
				twitch: "",
			},
		],
		bsr: "",
		watch: true,
		panel: true,
		streams: true,
		taip: {
			ip: "",
			password: "",
		},
	};

	file.write(JSON.stringify(defaultConfig, null, 2));
	opts = defaultConfig;
}

try {
	JSON.parse(fs.readFileSync(`${__dirname}\\info.json`, { encoding: "utf-8" }));
} catch (e) {
	console.log(`\x1b[32mFailed to parse JSON. ${e}`);
	process.exit();
}

if (opts.watch) {
	console.log("Now watching info.json");
	fs.watchFile(`${__dirname}\\info.json`, { interval: 500 }, () => {
		if (update == false) return;
		console.log("\x1b[32minfo.json updated. Getting new info!\x1b[0m");
		opts = file.read() as infoFile;
		saveData(opts);
	});
}

if (opts.streams) {
	if (!opts.watch) {
		console.log("\x1b[33mWatch Mode must be enabled for streams to enable. Streams Disabled");
	} else {
		stream_module.listen(opts);
		console.log("Streams Enabled. http://localhost/?v=0");
	}
}

if (opts.panel && (!opts.watch || !opts.streams)) {
	console.log("\x1b[33mWatch Mode and Streams must be enabled for the web panel to function. Panel Disabled.");
	opts.panel = false;
}

if (opts.taip && opts.taip.ip != "" && !opts.watch) {
	console.log("\x1b[33mWatch Mode must be enabled for TA Integration. TA Disabled.");
} else if (opts.taip.ip != "") {
	connectToTA(opts);
}

saveData(opts);
keepDir("data\\");

async function saveData(info: infoFile) {
	if (info.players) {
		info.players.forEach(async (pl) => {
			var data = await scoresaber.getUser(pl.id);
			if (data) {
				var img = await scoresaber.getImage(data);
				var index = info.players.indexOf(pl);
				keepDir(`data\\p${index}\\`);
				fs.writeFileSync(`${__dirname}\\data\\p${index}\\img.png`, img, { encoding: "binary" });

				saveFile(`p${index}\\name.txt`, data.playerInfo.playerName);
				saveFile(`p${index}\\rank.txt`, "#" + data.playerInfo.rank.toString());
				saveFile(`p${index}\\country_rank.txt`, "#" + data.playerInfo.countryRank.toString());

				if (pl.twitch) {
					saveFile(`p${index}\\twitch.txt`, pl.twitch);
				}
			}
		});
	}

	if (opts.streams && opts.watch) {
		stream_module.streamUpdate(opts);
	}

	if (opts.bsr) {
		getbs(opts.bsr);
	}
}

function connectToTA(data: infoFile) {
	IFTAManager.connectToTA(data);
}

// Map
async function getbs(bsr: string) {
	var map_data = await beatsaver.getMap(bsr);
	if (map_data) {
		var map_img = await beatsaver.getCover(map_data);
		keepDir("data\\song\\");

		fs.writeFileSync(`${__dirname}\\data\\song\\song_img.png`, map_img, { encoding: "binary" });
		saveFile("song\\song_map_name.txt", map_data.name);
		saveFile("song\\song_map_mapper.txt", map_data.uploader.username);
		saveFile("song\\song_map_code.txt", map_data.key);
	}
}

function saveFile(path: string, data: any) {
	fs.writeFileSync(`${__dirname}\\data\\${path}`, data, { encoding: "utf-8" });
}

function keepDir(path: string) {
	try {
		fs.readdirSync(`${__dirname}\\${path}`);
	} catch {
		fs.mkdirSync(`${__dirname}\\${path}`);
	}
}

function disableUpdate() {
	update = false;
}

export default {
	saveData,
	getbs,
	keepDir,
	saveFile,
	connectToTA,
	file,
	disableUpdate,
};
