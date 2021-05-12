import got from "got";
var gotClient = got.extend({
	headers: {
		"User-Agent": "Application/1.0.0 (+https://github.com/AsoDesu/info-grabber-2)",
	},
});

type beatsaverMap = {
	metadata: {
		difficulties: {
			easy: boolean;
			expert: boolean;
			expertPlus: boolean;
			hard: boolean;
			normal: boolean;
		};
		duration: number;
		automapper: null | "beatsage";
		characteristics: [
			{
				difficulties: {
					easy: null | difficulty;
					expert: null | difficulty;
					expertPlus: null | difficulty;
					hard: null | difficulty;
					normal: null;
				};
				name: string;
			}
		];
		levelAuthorName: string;
		songAuthorName: string;
		songName: string;
		songSubName: string;
		bpm: number;
	};
	stats: {
		downloads: number;
		plays: number;
		downVotes: number;
		upVotes: number;
		heat: number;
		rating: number;
	};
	description: string;
	deletedAt: null;
	_id: string;
	key: string;
	name: string;
	uploader: {
		_id: string;
		username: string;
	};
	hash: string;
	uploaded: string;
	directDownload: string;
	downloadURL: string;
	coverURL: string;
};

type difficulty = {
	duration: number;
	length: number;
	njs: number;
	njsOffset: number;
	bombs: number;
	notes: number;
	obstacles: number;
};

async function getMap(key: string) {
	var returnRes: any;
	await gotClient(`https://beatsaver.com/api/maps/detail/${key}`)
		.then(async (res) => {
			returnRes = await JSON.parse(res.body);
		})
		.catch(() => {
			console.log("\x1b[31mBeatSaver Returned 404, eaither the wrong key was entered, or beatsaver is down\x1b[0m");
			return false;
		});
	return returnRes as beatsaverMap;
}

async function getMapFromHash(hash: string) {
	var returnRes: any;
	await gotClient(`https://beatsaver.com/api/maps/by-hash/${hash}`)
		.then(async (res) => {
			returnRes = await JSON.parse(res.body);
		})
		.catch(() => {
			console.log("\x1b[31mBeatSaver Returned 404, eaither the wrong key was entered, or beatsaver is down\x1b[0m");
			return false;
		});
	return returnRes as beatsaverMap;
}

async function getImage(map: beatsaverMap) {
	var returnRes: any;
	await gotClient(`https://beatsaver.com${map.coverURL}`, { responseType: "buffer" })
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
