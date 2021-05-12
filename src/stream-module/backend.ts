import express from "express";
import wsserver from "ws";
import download from "./download";

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

var cachedOpts: infoFile;
var clients: wsserver[] = [];

export default {
	listen(opts: infoFile) {
		download();

		const ws = new wsserver.Server({ port: 81 });
		const app = express();

		app.use(express.static("InfoGrabber_ext"));

		ws.on("connection", (socket) => {
			clients.push(socket);
			socket.send(JSON.stringify(cachedOpts));
		});

		cachedOpts = opts;
		app.listen(80);
	},
	streamUpdate(opts: infoFile) {
		cachedOpts = opts;
		clients.forEach((socket) => {
			socket.send(JSON.stringify(opts));
		});
	},
};
