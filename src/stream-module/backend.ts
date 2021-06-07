import express from "express";
import wsserver from "ws";

import download from "./download";
import index from "../index";

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
	failed?: boolean | null;
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

			socket.on("message", (msg) => {
				index.disableUpdate();
				var data = JSON.parse(msg.toString()) as infoFile;
				if (opts.panel) {
					if (data.players) {
						cachedOpts.players = data.players;
					}
					if (data.taip) {
						cachedOpts.taip = data.taip;
						index.connectToTA(cachedOpts);
					}
					if (data.bsr) {
						cachedOpts.bsr = data.bsr;
					}

					if (data.players || data.bsr) index.saveData(cachedOpts);

					console.log("\x1b[32mUpdated via panel, Getting new info!\x1b[0m");
					send(JSON.stringify(cachedOpts));
					index.file.write(JSON.stringify(cachedOpts, null, 2));
				}
			});
		});

		cachedOpts = opts;
		app.listen(80);
	},
	streamUpdate(opts: infoFile) {
		cachedOpts = opts;
		send(JSON.stringify(opts));
	},
	failedToGet(id: string) {
		cachedOpts.players[cachedOpts.players.findIndex((p) => p.id == id)].failed = true;
		send(JSON.stringify(cachedOpts));
	},
};

function send(msg: string) {
	clients.forEach((socket) => {
		socket.send(msg);
	});
}
