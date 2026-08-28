const CONNECT_ENDPOINT = "https://donaldapi.kayladotcom.org/voicechat/connect"
const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] // temp
}

const PROFILE_STORAGE_KEY = "vc-profile"
const profile = {
    name: "User" + Math.floor(Math.random()*1000),
    icon: 0,
    id: null,

    gridentry: {}
}

function save() {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({
        name: profile.name,
        icon: profile.icon,

        input: INPUT_GAIN.value,
        output: OUTPUT_GAIN.value
    }))
    console.log("saved")
}

function setprofile(name, icon, forced=false) {
    profile.name = name
    profile.icon = icon

    save()

    if(forced) {
        profile.gridentry.name.textContent = name
        profile.gridentry.icon.setAttribute("iconid", icon)
        profile.gridentry.icon.src = `/chatroom/img/icons/icon${icon}.png`
    }
}

function flipicon() {
    let curid = parseInt(profile.gridentry.icon.getAttribute("iconid"))
    if(curid < 0) {
        return
    }

    console.log(curid)
    profile.gridentry.icon.setAttribute("iconid", (curid+1)%8)
    curid = parseInt(profile.gridentry.icon.getAttribute("iconid"))

    profile.gridentry.icon.src = `/chatroom/img/icons/icon${curid}.png`
}
function sendprofiledata() {
    socket.send(JSON.stringify({
        type: "update_profile",
        data: {
            name: profile.name,
            icon: profile.icon
        }
    }))
}

const BODY = document.getElementById("vc-body")

const MUTE_BUTTON = document.getElementById("mute")
const DEAFEN_BUTTON = document.getElementById("deafen")

const INPUT_GAIN = document.getElementById("inputgain")
const OUTPUT_GAIN = document.getElementById("outputgain")

function setinput(value) {
    if(!stream) {
        return
    }

    gainnode.gain.value = !muted ? value : 0
}
function setoutput(value) {
    for(const [id, peer] of peers) {
        console.log(id, peer)
        peer.audio.volume = value
    }
}

INPUT_GAIN.addEventListener("input", (e) => {
    setinput(INPUT_GAIN.value)
    save()
})
OUTPUT_GAIN.addEventListener("input", (e) => {
    setoutput(OUTPUT_GAIN.value)
    save()
})

let socket

let stream
let gainnode
let analysernode
let localvolume = 0

let muted = false
let deafened = false

MUTE_BUTTON.addEventListener("click", (e) => {
    if(!stream) {
        return
    }

    muted = !muted
    gainnode.gain.value = !muted ? INPUT_GAIN.value : 0

    socket.send(JSON.stringify({
        type: "mute",
        data: {
            muted: muted
        }
    }))

    let soundsrc = "snd/mute.ogg"
    let graphicsrc = "img/mute.png"
    let covercolor = "red"
    if(!muted) {
        soundsrc = "snd/unmute.ogg"
        graphicsrc = "img/unmute.png"
        covercolor = "black"
    }

    const sound = new Audio(soundsrc)
        sound.volume = .65
        sound.play()
    MUTE_BUTTON.querySelector("img").src = graphicsrc
    profile.gridentry.volbarcover.style.backgroundColor = covercolor
})
DEAFEN_BUTTON.addEventListener("click", (e) => {
    if(!stream) {
        return
    }

    deafened = !deafened
    for(const peer of peers.values()) {
        peer.audio.muted = deafened
    }

    socket.send(JSON.stringify({
        type: "deafen",
        data: {
            deafened: deafened
        }
    }))
    
    let soundsrc = "snd/deafen.ogg"
    let graphicsrc = "img/deafen.png"
    if(!deafened) {
        soundsrc = "snd/undeafen.ogg"
        graphicsrc = "img/undeafen.png"

        profile.gridentry.iconcontainer.classList.remove("deafened")
    } else {
        profile.gridentry.iconcontainer.classList.add("deafened")
    }

    const sound = new Audio(soundsrc)
        sound.volume = .65
        sound.play()
    DEAFEN_BUTTON.querySelector("img").src = graphicsrc
})

function makegridspot(user) {
    let vcPeer = document.createElement("div")
        vcPeer.className = "vc-peer"
        
        let vcPeerTop = document.createElement("div")
            vcPeerTop.className = "vc-peer-top"

            let vcIconContainer = document.createElement("div")
                vcIconContainer.className = "vc-icon-container"

                let vcIcon = document.createElement("img")
                    vcIcon.className = "vc-icon"
                    vcIcon.src = `/chatroom/img/icons/icon${user.icon}.png`
                    vcIcon.setAttribute("iconid", user.icon)
                vcIconContainer.append(vcIcon)

            let vcVolbar = document.createElement("div")
                vcVolbar.className = "vc-volbar"

                let vcVolbarCover = document.createElement("div")
                    vcVolbarCover.className = "vc-volbar-cover"
                
                vcVolbar.append(vcVolbarCover)
            vcPeerTop.append(vcIconContainer, vcVolbar)
        
        let vcName = document.createElement("p")
            vcName.contentEditable = false
            vcName.spellcheck = false
            vcName.textContent = user.name
        
        vcPeer.append(vcPeerTop, vcName)

    return {
        obj: vcPeer,

        name: vcName,
        icon: vcIcon,
        iconcontainer: vcIconContainer,
        volbar: vcVolbar,
        volbarcover: vcVolbarCover
    }
}

const peers = new Map()
class Peer {
    constructor(user, conn) {
        this.id = user.id
        this.profile = {
            name: user.name,
            icon: user.icon,

            changed: false
        }

        this.conn = conn
        this.candidatebacklog = []

        this.audio = new Audio()
        this.audio.autoplay = true
        this.audio.volume = OUTPUT_GAIN.value
        this.stream = null

        // add to grid
        const gridspot = makegridspot(user)
        this.gridentry = gridspot
        BODY.append(gridspot.obj)

        if(user.muted) {
            this.gridentry.volbarcover.style.backgroundColor = "red"
        }
        if(user.deafened) {
            this.gridentry.iconcontainer.classList.add("deafened")
        }

        this.setupconnection()
    }

    setupconnection() {
        for(const track of stream.getTracks()) {
            this.conn.addTrack(track, stream)
        }

        this.conn.addEventListener("icecandidate", (e) => {
            if(!e.candidate) {
                return
            }

            socket.send(JSON.stringify({
                type: "ice_candidate",
                data: {
                    to: this.id,
                    candidate: e.candidate
                }
            }))
        })
        this.conn.addEventListener("track", async (e) => {
            const ctx = new AudioContext()
            
            this.audio.srcObject = e.streams[0]
            this.audio.autoplay = true

            const source = ctx.createMediaStreamSource(e.streams[0])
                const analyser = ctx.createAnalyser()
                    analyser.fftSize = 512
                source.connect(analyser)

            const bufferlength = analyser.fftSize
            const dataarray = new Float32Array(bufferlength)

            const updatevolume = () => {
                analyser.getFloatTimeDomainData(dataarray)

                let sum = 0
                for (const val of dataarray) {
                    sum += val * val
                }

                const vol = Math.sqrt(sum / bufferlength) * 5
                this.gridentry.volbarcover.style.height =
                    `${(1 - vol) * 100}%`

                requestAnimationFrame(updatevolume)
            }
            updatevolume()

            if (ctx.state === "suspended") {
                await ctx.resume()
            }
        })
    }

    async dispatchbacklog() {
        for(const candidate of this.candidatebacklog) {
            await this.conn.addIceCandidate(candidate)
        }

        this.candidatebacklog = []
    }

    async addicecandidate(candidate) {
        if(!this.conn.remoteDescription) {
            this.candidatebacklog.push(candidate)
            return
        }

        // technically this will never dispatch the backlog if it is busy the entire time but sucks to suck
        await this.dispatchbacklog()
        await this.conn.addIceCandidate(candidate)
    }

    updateprofile(name, icon) {
        this.profile.name = name
        this.profile.icon = icon

        if(!this.profile.changed) {
            console.log("first change!")

            let csound = "connect"
            if(this.profile.icon < 0) {
                // special user
                csound += "-special"
            }

            const sound = new Audio(`snd/${csound}.ogg`)
                sound.volume = .65
                sound.play()
        }
        this.profile.changed = true

        this.gridentry.name.textContent = name
        this.gridentry.icon.src = `/chatroom/img/icons/icon${icon}.png`
    }

    destroy() {
        this.conn.close()
        this.audio.srcObject = null
        this.gridentry.obj.remove()
    }
}

const ACTIVATE_BUTTON = document.getElementById("activate")

async function makeconnection(user) {
    const conn = new RTCPeerConnection(config)
    const peer = new Peer(user, conn)

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

        peer.destroy()
        peers.delete(data.user.id)

        let dcsound = "disconnect"
        if(peer.profile.icon < 0) {
            // special user
            dcsound += "-special"
        }
        if(data.banned) {
            dcsound = "banned"
        }

        const sound = new Audio(`snd/${dcsound}.ogg`)
            sound.volume = .65
            sound.play()
    },

    async room_info(data) {
        BODY.replaceChildren()

        profile.id = data.your_id
        for(const user of data.connected_users) {
            const id = user.id

            if(peers.has(id)) {
                console.log(`skipping id ${id}`)
                continue
            }

            const peer = await makeconnection(user)
            peer.profile.changed = true // dont let them play the join sound
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

        // add to grid
        const gridspot = makegridspot(profile)
        gridspot.name.contentEditable = true
        gridspot.name.style.color = "#006c86"
        gridspot.name.style.fontStyle = "italic"
        gridspot.name.style.textDecoration = "underline"
        gridspot.iconcontainer.classList.add("vc-clickable")

        gridspot.name.addEventListener("keydown", (e) => {
            if(e.key === "Enter") {
                e.preventDefault()

                profile.name = gridspot.name.textContent

                setTimeout(() => {
                    gridspot.name.blur()
                }, 0)
            }
        })
        gridspot.name.addEventListener("focusout", (e) => {
            sendprofiledata()
        })

        gridspot.icon.addEventListener("click", (e) => {
            let lastid = parseInt(gridspot.icon.getAttribute("iconid"))
            flipicon()
            if(parseInt(gridspot.icon.getAttribute("iconid")) != lastid) {
                sendprofiledata()
            }
        })

        profile.gridentry = gridspot
        BODY.append(gridspot.obj)
        console.log(profile)

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
            console.log("we have been told our name")
            setprofile(data.name, data.icon, true)
            return
        }

        const peer = peers.get(data.id)
        peer.updateprofile(data.name, data.icon)
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

        peer.addicecandidate(data.candidate)
    },

    async mute(data) {
        const peer = peers.get(data.id)
        peer.gridentry.volbarcover.style.backgroundColor = data.muted ? "red" : "black"
    },
    async deafen(data) {
        const peer = peers.get(data.id)
        if(data.deafened) {
            peer.gridentry.iconcontainer.classList.add("deafened")
        } else {
            peer.gridentry.iconcontainer.classList.remove("deafened")
        }
    },

    async ban(data) {
        alert(data.reason)
        window.location.reload()
    },
    async system_message(data) {
        if(!'speechSynthesis' in window) {
            console.warn("could not play message")
            return
        }

        const utterance = new SpeechSynthesisUtterance(data.msg)

        const voices = window.speechSynthesis.getVoices()
        const david = voices.find((voice) => voice.name.includes("David"))
        if(david) {
            utterance.voice = david
        }

        window.speechSynthesis.speak(utterance)
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
    const status = document.getElementById("status")

    status.innerText = "getting microphone"
    stream = 
        await navigator.mediaDevices.getUserMedia(
            { audio: {
                autoGainControl: false,
                echoCancellation: true,
                noiseSuppression: true
            } }, 
        )
    
    let ctx = new AudioContext()
    let source = ctx.createMediaStreamSource(stream)
    let dest = ctx.createMediaStreamDestination()
    
    gainnode = ctx.createGain()
    gainnode.gain.value = 3
    source.connect(gainnode)
    
    analysernode = ctx.createAnalyser()
    analysernode.fftSize = 1024
    gainnode.connect(analysernode)
    analysernode.connect(dest)

    const bufferlength = analysernode.fftSize
    const dataarray = new Float32Array(bufferlength)

    function updatevolume() {
        analysernode.getFloatTimeDomainData(dataarray)

        let sum = 0
        for(const val of dataarray) {
            sum += val*val
        }

        localvolume = Math.sqrt(sum/bufferlength) * 5

        if(profile.gridentry.volbarcover) {
            profile.gridentry.volbarcover.style.height = `${(1-localvolume)*100}%`
        }
        requestAnimationFrame(updatevolume)
    }
    updatevolume()

    stream = dest.stream

    if(window.localStorage.getItem(PROFILE_STORAGE_KEY)) {
        status.innerText = "loading profile data..."
        const data = JSON.parse(window.localStorage.getItem(PROFILE_STORAGE_KEY))
        console.log(data)

        profile.name = data.name
        profile.icon = data.icon

        setinput(data.input)
        setoutput(data.output)
    }
    
    socket = new WebSocket(CONNECT_ENDPOINT)
    status.innerText = "waiting for server response..."

    await new Promise((resolve, reject) => {
        socket.addEventListener("open", resolve, { once: true })
        socket.addEventListener("error", (r) => {
            console.log(r)
            status.innerText = `failed to establish connection to server...\ntry refreshing?`
            
            reject(r)
        }, { once: true })
    })

    socket.addEventListener("message", handlepacket)
}

document.getElementById("activate").addEventListener("click", async (e) => {
    console.log("button hit")

    const blanker = document.getElementById("vc-blanker")

    blanker.replaceChildren()
    let status = document.createElement("p")
        status.id = "status"
        status.innerText = "connecting..."
    blanker.append(status)

    await connect()
    console.log("connected")
    blanker.remove()
})