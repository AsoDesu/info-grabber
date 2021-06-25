export interface packet {
	Size: number;
	SpecificPacketSize: number;
	Id: string;
	From: string;
	Type: number;
	SpecificPacket: any;
}

export interface Event_CoordinatorConnectResponse extends packet {
	SpecificPacket: {
		Self: coordinator;
		State: state;
		ServerVersion: number;
		Type: number;
		Message: string;
	};
}

export interface state {
	ServerSettings: serverConfig;
	Players: player[];
	Coordinators: coordinator[];
	Matches: match[];
	Events: any[];
	KnownHosts: string[];
}

export interface coordinator {
	GetIcon: string;
	UserId: string;
	Id: string;
	Name: string;
}

export interface server {
	Name: string;
	Address: string;
	Port: string;
}

export interface team {
	Id: string;
	Name: string;
}

export interface serverConfig {
	ServerName: string;
	Password: string;
	EnableTeams: boolean;
	Teams: team[];
	ScoreUpdateFrequency: number;
	BannedMods: string[];
}

export interface player {
	UserId: string;
	Team: team;
	PlayState: number;
	DownloadState: number;
	Score: number;
	Combo: number;
	Accuracy: number;
	SongPosition: number;
	SongList: null;
	ModList: string[];
	StreamScreenCoordinates: {
		x: number;
		y: 0;
	};
	StreamDelayMs: number;
	StreamSyncStartMs: number;
	Id: string;
	Name: string;
}

export interface match {
	Guid: string;
	Players: player[];
	Leader: coordinator;
	SelectedLevel: {
		LevelId: string;
		Name: string;
		Characteristics: characteristic[];
		Loaded: boolean;
	} | null;
	SelectedCharacteristic: characteristic | null;
	SelectedDifficulty: number;
}

export interface characteristic {
	SerializedName: string;
	Difficulties: number[];
}
