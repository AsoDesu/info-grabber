import fs from "fs";
import got from "got";
import path from "path";

async function downloadExtraData() {
	keepDir("InfoGrabber_ext");
	var html = (await got("https://raw.githubusercontent.com/AsoDesu/info-grabber/master/src/stream-module/index.html")).body;
	saveFile("InfoGrabber_ext\\index.html", html);
}

function saveFile(pathd: string, data: any) {
	fs.writeFileSync(path.join(process.cwd(), `${pathd}`), data, { encoding: "utf-8" });
}

function keepDir(pathd: string) {
	try {
		fs.readdirSync(path.join(process.cwd(), `${pathd}`));
	} catch {
		fs.mkdirSync(path.join(process.cwd(), `${pathd}`));
	}
}

export default downloadExtraData;
