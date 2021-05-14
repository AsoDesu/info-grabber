import { EventEmitter } from "events";
import WebSocket from "ws";

class TAManager extends EventEmitter {
	public connection: WebSocket = null;

	public ip: string;
	public port: string;

	constructor(IP: string) {
		super();
		this.connection = new WebSocket(`ws://${IP}`);

		this.connection.addEventListener("error", (e) => {
			console.log("Failed to connect to server, did you put the right overlay port?", e.type);
		});

		this.connection.addEventListener("close", () => {
			console.log("Failed to Connect");
			this.connection = null;
		});

		this.connection.addEventListener("open", () => {
			console.log("Connected to TA server!");
			this.connection.addEventListener("message", async (e) => {
				var msg = await JSON.parse(e.data);
				//console.log(e.data);
				switch (msg.Type) {
					case 4:
						this.PlayerEvent(msg);
						return;
				}
			});
		});
	}

	private send(msg: string) {
		this.connection.send(msg);
	}

	private PlayerEvent(msg: packet) {
		var packet = msg.SpecificPacket;
		var packetObject = packet.ChangedObject;
		switch (packet.Type) {
			case 1:
				if (msg.From == "00000000-0000-0000-0000-000000000000") return;
				if (packetObject.DownloadState != 0) return;
				//console.log(`Player with \'${packetObject.ModList.length}\' mods, named \'${packetObject.Name}\', just joined`);
				return;
			case 2:
				//console.log(`Player with \'${packetObject.ModList.length}\' mods, named \'${packetObject.Name}\', just left`);
				return;
			case 3:
				//console.log(`Coordinator with name \'${packetObject.Name}\', and id \'${packetObject.Id}\' just Joined`);
				return;
			case 4:
				//console.log("Coordinator with name " + packetObject.Name + " just Left");
				return;
			case 5:
				if (msg.From == "00000000-0000-0000-0000-000000000000") return;
				//console.log(`Match was created. Coordinator: ${packetObject.Leader.Name}, Player: ${packetObject.Players[0].Name}`);
				return;
			case 6:
				if (msg.From != "00000000-0000-0000-0000-000000000000" && packetObject.Players[0].PlayState == 0 && packetObject.SelectedCharacteristic == null) {
					//console.log(`Song was loaded in a match. Id: ${packetObject.Guid}, Players: ${packetObject.Players.length}, LevelName: ${packetObject.SelectedLevel.Name}`);
					this.emit("song-load", packetObject);
					return;
				}
				if (msg.From == "00000000-0000-0000-0000-000000000000" && packetObject.Players[0].PlayState != 0) {
					//console.log(`A Match Started. Id: ${packetObject.Guid}, Players: ${packetObject.Players.length}, LevelName: ${packetObject.SelectedLevel.Name}`);
					return;
				}
				if (msg.From == "00000000-0000-0000-0000-000000000000" && packetObject.Players[0].PlayState == 0 && packetObject.SelectedCharacteristic != null) {
					//console.log(`A song was completed in a match. Id: ${packetObject.Guid}, Players: ${packetObject.Players.length}, Player1Score: ${packetObject.Players[0].Score}`);
					return;
				}
				return;
			case 7:
				if ((msg.From = "00000000-0000-0000-0000-000000000000")) {
					//console.log(`Match was Ended. Id: ${packetObject.Guid}`);
				}
				return;
		}
		//console.log(msg);
	}
}

declare interface TAManager {
	on(event: "song-load", listener: (level: song_load) => void): this;
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
