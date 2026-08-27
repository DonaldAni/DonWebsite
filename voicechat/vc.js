const CONNECT_ENDPOINT = "https://donaldapi.kayladotcom.org/voicechat/connect"
const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // temp
}

let socket
let stream

const peers = new Map()
class Peer {
    constructor(id, conn) {
        this.id = id
        this.conn = conn

        this.candidatebacklog = []

        this.audio = new Audio()
        this.audio.autoplay = true
    }

    async dispatchbacklog() {
        for(const candidate of this.candidatebacklog) {
            await this.conn.addIceCandidate(candidate)
        }
    }
}

const ACTIVATE_BUTTON = document.getElementById("activate")
const AUDIO = document.getElementById("remote")

async function makeconnectionwithid(id) {
    if(peers.has(id)) {
        console.log("this procs multiple times")
    }

    const conn = new RTCPeerConnection(config)
    const peer = new Peer(id, conn)

    for(const track of stream.getTracks()) {
        conn.addTrack(track, stream)
    }

    conn.addEventListener("icecandidate", (e) => {
        if(!e.candidate) {
            return
        }

        socket.send(JSON.stringify({
            type: "ice_candidate",
            data: {
                to: id,
                candidate: e.candidate
            }
        }))
    })
    conn.addEventListener("track", (e) => {
        // temp! make dynamic audio objects later!
        peer.audio.srcObject = e.streams[0]
    })

    return peer
}

const packet_handlers = {
    async user_connected(data) {
        // we dont really care about this... all the stuff goes in the handshake
        console.log("ok")
        console.log(data)
    },
    async user_disconnected(data) {
        const peer = peers.get(data.id)
        if(!peer) {
            console.error("don't know who this user is...")
            return
        }

        peer.conn.close()
        peers.delete(data.id)
    },

    async room_info(data) {
        for(const id of data.connected_users) {
            if(peers.has(id)) {
                console.log(`skipping id ${id}`)
                continue
            }

            const peer = await makeconnectionwithid(id)
            peers.set(id, peer)

            await peer.conn.setLocalDescription(
                await peer.conn.createOffer()
            )

            socket.send(JSON.stringify({
                type: "offer",
                data: {
                    to: id,
                    offer: peer.conn.localDescription
                }
            }))
        }
    },

    async offer(data) {
        const peer = await makeconnectionwithid(data.from)
        peers.set(data.from, peer)
        await peer.conn.setRemoteDescription(data.offer)

        await peer.conn.setLocalDescription(
            await peer.conn.createAnswer()
        )

        socket.send(JSON.stringify({
            type: "answer",
            data: {
                to: data.from,
                answer: peer.conn.localDescription
            }
        }))
    },
    async answer(data) {
        const peer = peers.get(data.from)
        if(!peer) {
            console.error("don't know who this answer is from...")
            return
        }

        await peer.conn.setRemoteDescription(data.answer)
    },
    async ice_candidate(data) {
        const peer = peers.get(data.from)
        if(!peer) {
            console.error("don't know who this ice candidate is for...")
            return
        }

        if(!peer.conn.remoteDescription) {
            peer.candidatebacklog.push(data.candidate)
            return
        }

        await peer.dispatchbacklog()
        await peer.conn.addIceCandidate(data.candidate)
    }
}

async function handlepacket(e) {
    const packet = JSON.parse(e.data)
    console.log(packet)

    if(!packet.type) {
        console.log("welp!")
        return
    }

    const handler = packet_handlers[packet.type]

    if(!handler) {
        console.log("umm...")
        return
    }

    handler(packet.data)
}

async function connect() {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    
    socket = new WebSocket(CONNECT_ENDPOINT)

    await new Promise((resolve, reject) => {
        socket.addEventListener("open", resolve, { once: true })
        socket.addEventListener("error", reject, { once: true })
    })

    socket.addEventListener("message", handlepacket)
}

document.getElementById("activate").addEventListener("click", (e) => {
    connect()
})