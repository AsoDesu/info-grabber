import scoresaber from './scoresaberApiGrabber'
import beatsaver from './beatsaverApi'
import ejs from 'edit-json-file'
import fs from 'fs'

import stream_module from './stream-module/backend'

const file = ejs(`${__dirname}/info.json`)

type infoFile = {
    id1: string,
    id2: string,
    twitch1: string,
    twitch2: string,
    bsr: string,
    watch: boolean,
    streams: boolean
}

var opts = file.read() as infoFile

try {
    fs.readFileSync(`${__dirname}\\info.json`)
} catch {
    file.set('id1', '')
    file.set('id2', '')
    file.set('twitch1', '')
    file.set('twitch2', '')
    file.set('bsr', '')
    file.set('watch', false)
    file.set('streams', false)
    file.save()
}

if (opts.watch) {
    console.log('Now watching info.json')
    fs.watchFile(`${__dirname}\\info.json`, { interval: 500 }, () => {
        console.log('\x1b[32minfo.json updated. Getting new info!\x1b[0m')
        opts = file.read() as infoFile
        saveData()
    })
}

if (opts.streams) {
    if (!opts.watch) {
        console.log('\x1b[31mWatch Mode must be enabled for streams to enable. Streams Disabled')
    } else {
        stream_module.listen(opts)
        console.log('Streams Enabled. http://localhost/?v=twitch1')
    }
}

saveData()

async function saveData() {
    keepDir('data\\')

    if (!isNaN(parseInt(opts.id1))) { getp1() }
    if (!isNaN(parseInt(opts.id2))) { getp2() }
    if (opts.streams && opts.watch) { stream_module.streamUpdate(opts) }
    if (opts.bsr) { getbs() }

    // Player 1
    async function getp1() {
        var p1_data = await scoresaber.getUser(opts.id1)
        if (p1_data) {
            var p1_img = await scoresaber.getImage(p1_data)
            keepDir('data\\p1\\')
            fs.writeFileSync(`${__dirname}\\data\\p1\\p1_img.png`, p1_img, { encoding: 'binary' })

            saveFile(`p1\\p1_name.txt`, p1_data.playerInfo.playerName)
            saveFile(`p1\\p1_rank.txt`, '#' + p1_data.playerInfo.rank.toString())
            saveFile(`p1\\p1_country_rank.txt`, '#' + p1_data.playerInfo.countryRank.toString())
        }
    }

    // Player 2
    async function getp2() {
        var p2_data = await scoresaber.getUser(opts.id2)
        if (p2_data) {
            var p2_img = await scoresaber.getImage(p2_data)
            keepDir('data\\p2\\')

            fs.writeFileSync(`${__dirname}\\data\\p2\\p2_img.png`, p2_img, { encoding: 'binary' })

            saveFile(`p2\\p2_name.txt`, p2_data.playerInfo.playerName)
            saveFile(`p2\\p2_rank.txt`, '#' + p2_data.playerInfo.rank.toString())
            saveFile(`p2\\p2_country_rank.txt`, '#' + p2_data.playerInfo.countryRank.toString())
        }
    }

    // Map
    async function getbs() {
        var map_data = await beatsaver.getMap(opts.bsr)
        if (map_data) {
            var map_img = await beatsaver.getCover(map_data)
            keepDir('data\\song\\')

            fs.writeFileSync(`${__dirname}\\data\\song\\song_img.png`, map_img, { encoding: 'binary' })
            saveFile('song\\song_map_name.txt', map_data.name)
            saveFile('song\\song_map_mapper.txt', map_data.uploader.username)
            saveFile('song\\song_map_code.txt', map_data.key)
        }
    }
}

function saveFile(path: string, data: any) {
    fs.writeFileSync(`${__dirname}\\data\\${path}`, data, { encoding: 'utf-8' })
}

function keepDir(path: string) {
    try {
        fs.readdirSync(`${__dirname}\\${path}`)
    } catch {
        fs.mkdirSync(`${__dirname}\\${path}`)
    }
}