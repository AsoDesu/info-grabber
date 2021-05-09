import scoresaber from "./scoresaberApiGrabber";
import beatsaver from "./beatsaverApi";
import ejs from "edit-json-file";
import fs from "fs";

import stream_module from "./stream-module/backend";

const file = ejs(`${__dirname}/info.json`);

type infoFile = {
	players: player[];
	bsr: string;
	watch: boolean;
	streams: boolean;
};

type player = {
	id: string;
	twitch: string;
};

var opts = file.read() as infoFile;

try {
	fs.readFileSync(`${__dirname}\\info.json`);
} catch {
	file.set("players", [{ id: "", twitch: "" }]);
	file.set("bsr", "");
	file.set("watch", false);
	file.set("streams", false);
	file.save();
}

if (opts.watch) {
	console.log("Now watching info.json");
	fs.watchFile(`${__dirname}\\info.json`, { interval: 500 }, () => {
		console.log("\x1b[32minfo.json updated. Getting new info!\x1b[0m");
		opts = file.read() as infoFile;
		saveData();
	});
}

if (opts.streams) {
	if (!opts.watch) {
		console.log("\x1b[31mWatch Mode must be enabled for streams to enable. Streams Disabled");
	} else {
		stream_module.listen(opts);
		console.log("Streams Enabled. http://localhost/?v=0");
	}
}

saveData();

async function saveData() {
	keepDir("data\\");

	if (opts.players) {
		opts.players.forEach(async (pl) => {
			var data = await scoresaber.getUser(pl.id);
			if (data) {
				var img = await scoresaber.getImage(data);
				var index = opts.players.indexOf(pl);
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
		getbs();
	}

	// Map
	async function getbs() {
		var map_data = await beatsaver.getMap(opts.bsr);
		if (map_data) {
			var map_img = await beatsaver.getCover(map_data);
			keepDir("data\\song\\");

			fs.writeFileSync(`${__dirname}\\data\\song\\song_img.png`, map_img, { encoding: "binary" });
			saveFile("song\\song_map_name.txt", map_data.name);
			saveFile("song\\song_map_mapper.txt", map_data.uploader.username);
			saveFile("song\\song_map_code.txt", map_data.key);
		}
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
