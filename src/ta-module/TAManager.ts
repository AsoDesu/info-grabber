import { EventEmitter } from "events";
import * as types from "./TATypes";
import WebSocket from "ws";
import { v4 } from "uuid";

class TAManager extends EventEmitter {
	public connection: WebSocket = null;

	public ip: string;
	public port: string;

	public serverState: types.state;

	constructor(IP: string, password?: string) {
		super();
		this.connection = new WebSocket(`ws://${IP}`);

		this.connection.addEventListener("error", (e) => {
			this.emit("err");
			console.log("\x1b[31mFailed to connect to server, did you put the right overlay port?", e.message);
		});

		this.connection.addEventListener("close", () => {
			this.connection = null;
		});

		this.connection.addEventListener("open", () => {
			console.log(`\x1b[32mConnected to TA server! ${IP}`);

			this.connection.addEventListener("message", async (e) => {
				var msg = (await JSON.parse(e.data)) as packet;
				//console.log(e.data);
				switch (msg.Type) {
					case 4:
						this.PlayerEvent(msg);
						return;
				}
			});

			process.on("exit", () => {
				this.disconnect();
			});
		});
	}

	private send(msg: string) {
		this.connection.send(msg);
	}

	private PlayerEvent(msg: packet) {
		var packet = msg.SpecificPacket;
		var packetObject = packet.ChangedObject;
		if (msg.From == "00000000-0000-0000-0000-000000000000") return;
		switch (packet.Type) {
			case 1:
				if (packetObject.DownloadState != 0) return;
				//console.log(`Player with \'${packetObject.ModList.length}\' mods, named \'${packetObject.Name}\', just joined`);
				return;
			case 2:
				//console.log(`Player with \'${packetObject.ModList.length}\' mods, named \'${packetObject.Name}\', just left`);
				return;
			case 3:
				if (!this.serverState) return;
				this.serverState.Coordinators.push(packetObject);
				this.emit("state-change", this.serverState);
				//console.log(`Coordinator with name \'${packetObject.Name}\', and id \'${packetObject.Id}\' just Joined`);
				return;
			case 4:
				console.log("coord left");
				/*this.serverState.Coordinators.splice(
					this.serverState.Coordinators.findIndex((c) => (c.Id = packetObject.Id)),
					1
				); */
				this.emit("state-change", this.serverState);
				//console.log("Coordinator with name " + packetObject.Name + " just Left");
				return;
			case 5:
				this.serverState.Matches.push(packetObject);
				this.emit("state-change", this.serverState);
				return;
			case 6:
				this.serverState.Matches[this.serverState.Matches.findIndex((m) => m.Guid == packetObject.Guid)] = packetObject;
				this.emit("state-change", this.serverState);
				if (packetObject.Players[0].PlayState == 0 && packetObject.SelectedCharacteristic == null) {
					//console.log(`Song was loaded in a match. Id: ${packetObject.Guid}, Players: ${packetObject.Players.length}, LevelName: ${packetObject.SelectedLevel.Name}`);
					this.emit("song-load", packetObject);
					return;
				}
			case 7:
				if ((msg.From = "00000000-0000-0000-0000-000000000000")) {
					//console.log(`Match was Ended. Id: ${packetObject.Guid}`);
				}
				return;
		}
		//console.log(msg);
	}

	public disconnect() {
		this.serverState.Coordinators.forEach((c) => {
			if (c.Name.includes("Info Grabber")) {
				console.log("Id: " + c.Id);
				var data = {
					Size: 0,
					SpecificPacketSize: 44,
					Id: v4(),
					From: v4(),
					Type: 4,
					SpecificPacket: { Type: 4, ChangedObject: c },
				};
				this.connection.send(JSON.stringify(data));
			}
		});
	}
}

declare interface TAManager {
	on(event: "song-load", listener: (level: song_load) => void): this;
	on(event: "err", listener: () => void): this;
	on(event: "connect", listener: (state: types.state) => void): this;
	on(event: "state-change", listener: (state: types.state) => void): this;
}

type coordinator = {
	GetIcon: string;
	UserId: string;
	Id: string;
	Name: string;
};

type packet = {
	Size: number;
	SpecificPacketSize: number;
	Id: string;
	From: string;
	Type: number;
	SpecificPacket: any;
};

type song_load = {
	Guid: any;
	Players: player[];
	Leader: coordinator;
	SelectedLevel: {
		LevelId: string;
		Name: string;
		Characteristics: [
			{
				SerializedName: string;
				Difficulties: any[];
			}
		];
		Loaded: boolean;
	};
	SelectedCharacteristic: any;
	SelectedDifficulty: any;
};

type player = {
	UserId: string;
	Team: {
		Id: string;
		Name: string;
	};
	PlayState: any;
	DownloadState: any;
	Score: number;
	Combo: number;
	Accuracy: number;
	SongPosition: number;
	SongList: any;
	ModList: string[];
	StreamScreenCoordinates: {
		x: number;
		y: number;
	};
	StreamDelayMs: number;
	StreamSyncStartMs: number;
	Id: string;
	Name: string;
};

export default TAManager;
