import * as types from "./ta-module/TATypes";

type infoFile = {
	players: player[];
	song: {
		bsr: string;
		diff: string;
		failed?: boolean;
	};
	watch: boolean;
	streams: boolean;
	panel: boolean;
	taip: {
		ip: string;
		password: string;
		failed?: boolean;
		state?: types.state;
	};
};

type player = {
	id: string;
	twitch: string;
	failed?: boolean;
};

export type { infoFile, player };
