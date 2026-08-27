const CONNECT_ENDPOINT = "https://donaldapi.kayladotcom.org/voicechat/connect"
const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // temp
}

let socket
let stream
const peers = new Map()

const ACTIVATE_BUTTON = document.getElementById("activate")
const AUDIO = document.getElementById("remote")

async function makeconnectionwithid(id) {
    const conn = new RTCPeerConnection(config)

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
        AUDIO.srcObject = e.streams[0]
    })

    return conn
}

const packet_handlers = {
    async room_info(data) {
        for(const id of data.connected_users) {
            if(peers.has(id)) {
                console.log(`skipping id ${id}`)
                continue
            }

            const conn = await makeconnectionwithid(id)
            peers.set(id, conn)

            await conn.setLocalDescription(
                await conn.createOffer()
            )

            socket.send(JSON.stringify({
                type: "offer",
                data: {
                    to: id,
                    offer: conn.localDescription
                }
            }))
        }
    },

    async offer(data) {
        const conn = await makeconnectionwithid(data.from)
        await conn.setRemoteDescription(data.offer)

        await conn.setLocalDescription(
            await conn.createAnswer()
        )

        peers.set(data.from, conn)
        socket.send(JSON.stringify({
            type: "answer",
            data: {
                to: data.from,
                answer: conn.localDescription
            }
        }))
    },
    async answer(data) {
        const conn = peers.get(data.from)
        if(!conn) {
            console.error("don't know who this answer is from...")
            return
        }

        await conn.setRemoteDescription(data.answer)
    },
    async ice_candidate(data) {
        const conn = peers.get(data.from)
        if(!conn) {
            console.error("don't know who this ice candidate is for...")
            return
        }

        if(!conn.remoteDescription) {
            console.log("i cant handle this right now! im frrrrreaking out!")
            return
        }

        await conn.addIceCandidate(data.candidate)
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