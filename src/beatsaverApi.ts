import got from "got";
import { BeatSaverMap } from "./Types";
var gotClient = got.extend({
	headers: {
		"User-Agent": "Application/1.0.0 (+https://github.com/AsoDesu/info-grabber-2)",
	},
});

async function getMap(key: string) {
	var returnRes: any;
	await gotClient(`https://beatsaver.com/api/maps/id/${key}`)
		.then(async (res) => {
			returnRes = await JSON.parse(res.body);
		})
		.catch(() => {
			console.log("\x1b[31mBeatSaver Returned 404, eaither the wrong key was entered, or beatsaver is down\x1b[0m");
			return false;
		});
	return returnRes as BeatSaverMap;
}

async function getMapFromHash(hash: string) {
	var returnRes: any;
	await gotClient(`https://beatsaver.com/api/maps/hash/${hash}`)
		.then(async (res) => {
			returnRes = await JSON.parse(res.body);
		})
		.catch(() => {
			console.log("\x1b[31mBeatSaver Returned 404, eaither the wrong key was entered, or beatsaver is down\x1b[0m");
			return false;
		});
	return returnRes as BeatSaverMap;
}

async function getImage(map: BeatSaverMap) {
	var returnRes: any;
	await gotClient(`${map.versions[map.versions.length - 1].coverURL}`, { responseType: "buffer" })
		.then(async (res) => {
			returnRes = res.body;
		})
		.catch(() => {
			console.log("\x1b[31mBeatSaver Returned 404, eaither the wrong key was entered, or beatsaver is down\x1b[0m");
			return false;
		});
	return returnRes;
}

export default {
	getMap: getMap,
	getCover: getImage,
	getMapFromHash,
};
