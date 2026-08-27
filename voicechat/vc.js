const CONNECT_ENDPOINT = "https://donaldapi.kayladotcom.org/voicechat/connect"
const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // temp
}

const NAME_INPUT = document.getElementById("nameinput")
const ICON_INPUT = document.getElementById("iconinput")
const CHANGE_BUTTON = document.getElementById("changeprofile")
const profile = {
    name: "User" + Math.floor(Math.random()*1000),
    icon: 0,
    id: null
}
function setprofile(name, icon) {
    profile.name = name
    profile.icon = icon

    NAME_INPUT.value = name
    ICON_INPUT.value = icon
}

CHANGE_BUTTON.addEventListener("click", (e) => {
    e.preventDefault()

    socket.send(JSON.stringify({
        type: "update_profile",
        data: {
            name: NAME_INPUT.value,
            icon: parseInt(ICON_INPUT.value)
        }
    }))
})

const CURRENTLY_ONLINE_UL = document.getElementById("currentlyonline")

let socket
let stream

const peers = new Map()
class Peer {
    constructor(user, conn) {
        this.id = user.id
        this.profile = {
            name: user.name,
            icon: user.icon
        }

        this.conn = conn
        this.candidatebacklog = []

        this.audio = new Audio()
        this.audio.autoplay = true

        // add to online list
        let li = document.createElement("li")
            li.id = this.id
            li.textContent = user.name
        CURRENTLY_ONLINE_UL.append(li)
    }

    async dispatchbacklog() {
        for(const candidate of this.candidatebacklog) {
            await this.conn.addIceCandidate(candidate)
        }

        this.candidatebacklog = []
    }
}

const ACTIVATE_BUTTON = document.getElementById("activate")
const AUDIO = document.getElementById("remote")

async function makeconnection(user) {
    const conn = new RTCPeerConnection(config)
    const peer = new Peer(user, conn)

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
                to: user.id,
                candidate: e.candidate
            }
        }))
    })
    conn.addEventListener("track", (e) => {
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
        const peer = peers.get(data.user.id)
        if(!peer) {
            console.error("don't know who this user is...")
            return
        }

        peer.conn.close()
        document.getElementById(peer.id).remove()
        peers.delete(data.user.id)
    },

    async room_info(data) {
        CURRENTLY_ONLINE_UL.replaceChildren()

        profile.id = data.your_id
        for(const user of data.connected_users) {
            const id = user.id

            if(peers.has(id)) {
                console.log(`skipping id ${id}`)
                continue
            }

            const peer = await makeconnection(user)
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

        let li = document.createElement("li")
            li.id = "-1"
            li.textContent = "you!"
        CURRENTLY_ONLINE_UL.prepend(li)

        socket.send(JSON.stringify({
            type: "update_profile",
            data: {
                name: profile.name,
                icon: profile.icon
            }
        }))
    },
    async update_profile(data) {
        if(data.id == profile.id) {
            setprofile(data.name, data.icon)
            return
        }

        const peer = peers.get(data.id)
        peer.profile.name = data.name
        peer.profile.icon = data.icon

        const li = document.getElementById(data.id)
            li.textContent = data.name
    },

    async offer(data) {
        const peer = await makeconnection(data.from)
        peers.set(data.from.id, peer)
        await peer.conn.setRemoteDescription(data.offer)

        await peer.conn.setLocalDescription(
            await peer.conn.createAnswer()
        )

        socket.send(JSON.stringify({
            type: "answer",
            data: {
                to: data.from.id,
                answer: peer.conn.localDescription
            }
        }))
    },
    async answer(data) {
        const peer = peers.get(data.from.id)
        if(!peer) {
            console.error("don't know who this answer is from...")
            return
        }

        await peer.conn.setRemoteDescription(data.answer)
    },
    async ice_candidate(data) {
        const peer = peers.get(data.from.id)
        if(!peer) {
            console.error("don't know who this ice candidate is for...")
            return
        }

        if(!peer.conn.remoteDescription) {
            peer.candidatebacklog.push(data.candidate)
            return
        }

        // technically this will never dispatch the backlog if it is busy the entire time but sucks to suck
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