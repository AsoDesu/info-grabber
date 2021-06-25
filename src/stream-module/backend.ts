import express from "express";
import wsserver from "ws";

import { infoFile, player } from "../Types";

import download from "./download";
import index from "../index";
import ta from "../ta-module/IFTAManager";
import path from "path";

var cachedOpts: infoFile;
var clients: wsserver[] = [];

export default {
	listen(opts: infoFile) {
		download();

		const ws = new wsserver.Server({ port: 81 });
		const app = express();

		app.use(express.static(path.join(process.cwd(), "InfoGrabber_ext")));

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
					if (data.taip && data.taip.ip != "") {
						if (data.taip.ip == "1" && data.taip.password == "1") {
							ta.getManager().disconnect();
							return;
						}
						cachedOpts.taip = data.taip;
						index.connectToTA(cachedOpts);
					}
					if (data.song) {
						cachedOpts.song = data.song;
					}

					if (data.players || data.song) index.saveData(cachedOpts);

					console.log("\x1b[32mUpdated via panel, Getting new info!\x1b[0m");
					send(JSON.stringify(cachedOpts));
					index.file.write(JSON.stringify(cachedOpts, null, 2));
					index.opts = cachedOpts;
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
	failedToGetPlayer(id: string) {
		cachedOpts.players[cachedOpts.players.findIndex((p) => p.id == id)].failed = true;
		send(JSON.stringify(cachedOpts));
	},
	failedToGetMap() {
		cachedOpts.song.failed = true;
		send(JSON.stringify(cachedOpts));
	},
	failedToConnect() {
		cachedOpts.taip.failed = true;
		send(JSON.stringify(cachedOpts));
	},
	send,
};

function send(msg: string) {
	clients.forEach((socket) => {
		socket.send(msg);
	});
}
