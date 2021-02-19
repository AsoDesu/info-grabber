import fs from 'fs'
import got from 'got'

async function downloadExtraData() {
    keepDir('..\\InfoGrabber_ext')
    var html = (await got('https://raw.githubusercontent.com/AsoDesu/info-grabber/master/src/stream-module/index.html')).body
    saveFile('..\\InfoGrabber_ext\\index.html', html)
}

function saveFile(path: string, data: any) {
    fs.writeFileSync(`${__dirname}\\${path}`, data, { encoding: 'utf-8' })
}

function keepDir(path: string) {
    try {
        fs.readdirSync(`${__dirname}\\${path}`)
    } catch {
        fs.mkdirSync(`${__dirname}\\${path}`)
    }
}

export default downloadExtraData