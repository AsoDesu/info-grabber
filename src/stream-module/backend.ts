import express from 'express'
import wsserver from 'ws'
import download from './download'

type infoFile = {
    id1: string,
    id2: string,
    twitch1: string,
    twitch2: string,
    bsr: string,
    watch: boolean,
    streams: boolean
}

var cachedOpts: infoFile
var clients: wsserver[] = []

export default {
    listen(opts: infoFile) {
        download()

        const ws = new wsserver.Server({ port: 81 })
        const app = express()

        app.use(express.static('InfoGrabber_ext'))

        ws.on('connection', (socket) => {
            clients.push(socket)
            socket.send(JSON.stringify(cachedOpts))
        })

        cachedOpts = opts
        app.listen(80)
    },
    streamUpdate(opts: infoFile) {
        cachedOpts = opts
        clients.forEach((socket) => {
            socket.send(JSON.stringify(opts))
        })
    }
}