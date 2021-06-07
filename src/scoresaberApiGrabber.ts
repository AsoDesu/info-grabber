import got from "got";

type scoreSaber = {
	playerInfo: {
		playerId: string;
		playerName: string;
		avatar: string;
		rank: number;
		countryRank: number;
		pp: number;
		country: string;
		role: any;
		badges: [];
		history: string;
		permissions: number;
		inactive: number;
		banned: number;
	};
	scoreStats: {
		totalScore: number;
		totalRankedScore: number;
		averageRankedAccuracy: number;
		totalPlayCount: number;
		rankedPlayCount: number;
	};
};

async function getUser(uid: string) {
	var returnRes: any;
	await got(`https://new.scoresaber.com/api/player/${uid}/full`)
		.then(async (res) => {
			returnRes = await JSON.parse(res.body);
		})
		.catch(() => {
			console.log("\x1b[31mUser was not found, either the wrong scoresaber id was provided, or new.scoresaber is down\x1b[0m");
			return false;
		});
	return returnRes as scoreSaber;
}

async function getImage(data: scoreSaber) {
	var returnRes: any;
	await got(`https://new.scoresaber.com${data.playerInfo.avatar}`, { responseType: "buffer" })
		.then(async (res) => {
			returnRes = res.body;
		})
		.catch(() => {
			console.log("\x1b[31mScoreSaber Returned 404, either the wrong profile was entered, or scoresaber is down\x1b[0m");
			return false;
		});
	return returnRes;
}

export default {
	getUser: getUser,
	getImage: getImage,
};
