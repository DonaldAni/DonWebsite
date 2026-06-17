// constants
const CHATROOM_ENDPOINT = "https://phil.kayladotcom.org/donchatroom"
const PING_INTERVAL = 5000
const SAVE_DATA_KEY = "chatroom-profile"

// sounds
const SEND_SOUND = document.createElement("audio")
    SEND_SOUND.src = "sound/send.mp3"
const RECIEVE_SOUND = document.createElement("audio")
    RECIEVE_SOUND.src = "sound/recieve.mp3"
const NEW_TOPIC_SOUND = document.createElement("audio")
    NEW_TOPIC_SOUND.src = "sound/topic.mp3"

// chat room elements
let root = document.getElementById("chatroomroot")

let nameinput = document.getElementById("chatroomnameinput")
let iconselect = document.getElementById("iconselect")
let iconimg = document.getElementById("selicon")

let history = document.getElementById("chatroomhistory")
let input = document.getElementById("chatroominput")

let topicdisplay = document.getElementById("philtopic")

// special name stuff
let spidx = 0
class SpecialName {
    constructor(color, notifsound) {
        this.icon = --spidx
        this.color = color

        if(notifsound !== undefined) {
            this.notifsound = document.createElement("audio")
                this.notifsound.src = `sound/special/${notifsound}.mp3`
        }
    }

    getcss() {
        return `
            color: ${this.color};
            border-bottom: 1px dashed ${this.color};
        `
    }

    getnotifsound() {
        if(this.notifsound) {
            return this.notifsound
        }

        return RECIEVE_SOUND
    }
}

// you need to add in order of the icons, descending. e.g.:
const namemap = {
    "donaldani": new SpecialName('#ff7700', 'donaldrecieve'), // this is -1
    "ms_kaylaa": new SpecialName('#ff72c0', 'kaylarecieve'), // this is -2
    "ukubabe": new SpecialName('#575799', 'ukurecieve'), // this is -3
    "paint": new SpecialName('#1c2dc5', 'paintrecieve') // etc
}

// chatroom vars
let name = "PoopFart"
let icon = 0
let usingspecial = false
let maxicon = 7

let knowntopic = ""

let connected = true
let lastsuccessfulping = Date.now()

let loadedinitialmessages = false

let nameadjectives = []
let namenouns = []

// load from file
fetch("js/autogennames/adjectives.txt").then(res => res.text()).then(data => {
    nameadjectives = data.split("\n").filter(line => line.trim().replaceAll("\r", "").length > 0)
    nameadjectives = nameadjectives.map(line => line.replaceAll("\r", ""))
})
fetch("js/autogennames/nouns.txt").then(res => res.text()).then(data => {
    namenouns = data.split("\n").filter(line => line.trim().length > 0)
    namenouns = namenouns.map(line => line.replaceAll("\r", ""))
})

// functions
    function disconnect() {
        connected = false

        root.replaceChildren()

        let downnotice = document.createElement("p")
            downnotice.textContent = "lost connection: refresh the page"
            downnotice.className = "downnotice"

        root.appendChild(downnotice)
    }

    function sanitizetextHTMLsafe(text) {
        return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    }

    function rendermessage(messagedata) {
        let chat = document.createElement("div")
            chat.className = "chat"
            chat.id = messagedata.id

            let special = checkifspecial(messagedata.name)
            if(special) {
                chat.style = special.getcss()
                messagedata.icon = special.icon
            }

            let system = 'system' in messagedata

            let chatmain = document.createElement("div")
                chatmain.className = "chatmain"

                let icon = document.createElement("img")
                    icon.src = formaticonid(messagedata.icon)

                    if(system) {
                        icon.src = formaticonid("phil")
                        chat.classList.add("systemchat")
                    }

                let text = document.createElement("p")
                    text.innerHTML = `&lt;${messagedata.name}&gt; ${sanitizetextHTMLsafe(messagedata.text).replaceAll(name, `<span style="color: yellow;">${name}</span>`)}`

                chatmain.append(icon, text)
            chat.append(chatmain)

            let chatside = document.createElement("div")
                chatside.className = "chatside"

                let time = document.createElement("p")
                    time.className = "time"
                let date = document.createElement("p")
                    date.className = "time"
                
                let messageDate = new Date(messagedata.time * 1000)
                time.textContent = messageDate.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
                date.textContent = messageDate.toLocaleDateString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: '2-digit'
                })
                
                chatside.append(time, date)
            chat.append(chatside)

        history.appendChild(chat)

        history.scrollTop = history.scrollHeight
    }

    function settopic(newtopic) {
        knowntopic = newtopic
        topicdisplay.textContent = `CHAT TOPIC: ${newtopic}`

        if(loadedinitialmessages) {
            NEW_TOPIC_SOUND.play()
            
            rendermessage({
                name: "SYSTEM",
                icon: 0,
                text: `CHAT TOPIC: ${newtopic}`,
                time: Date.now() / 1000,
                system: true,
                id: crypto.randomUUID()
            })
        }
    }

    // name funcs
        function generaterandomname() {
            let adj = nameadjectives[Math.floor(Math.random() * nameadjectives.length)]
            let noun = namenouns[Math.floor(Math.random() * namenouns.length)]

            return adj + noun
        }

        function setname(newname) {
            name = newname
            nameinput.value = newname
        }

        function checkifspecial(name) {
            if(name.toLowerCase() in namemap) {
                return namemap[name.toLowerCase()]
            }
            return false
        }

    // icon funcs
        function formaticonid(id) {
            return `img/icons/icon${id}.png`
        }

        function getrandomicon() {
            return Math.floor(Math.random() * (maxicon + 1))
        }

        function seticon(newicon) {
            icon = newicon
            iconimg.src = formaticonid(newicon)
        }

    // save data funcs
        function savedataexists() {
            return window.localStorage.getItem(SAVE_DATA_KEY) !== null
        }

        function savestuff(name, icon) {
            window.localStorage.setItem(SAVE_DATA_KEY, JSON.stringify({
                name: name,
                icon: icon
            }))
        }

        function loadstuff() {
            let saved = window.localStorage.getItem(SAVE_DATA_KEY)

            if(saved !== null) {
                try {
                    let parsed = JSON.parse(saved)
                    if('name' in parsed && 'icon' in parsed) {
                        return parsed
                    }
                } catch(e) {
                    console.log("failed to parse saved profile")
                }
            }
        }

// hooks
input.addEventListener('keydown', async (e)=>{
    if(connected && e.key === "Enter") {
        e.preventDefault()
        
        let text = input.value.trim()
        if(text.trim().length === 0) {
            alert("You cannot send an empty message")
            return
        }
        input.value = ""

        let id = crypto.randomUUID()
        
        if(name.length == 0) {
            setname(generaterandomname())
            savestuff(name, icon)
        }

        let message = {
            name: name,
            icon: icon,
            text: text,
            id: id,
            time: Date.now() / 1000
        }
        
        const response = await fetch(CHATROOM_ENDPOINT + "/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        })

        if(!response.ok) {
            switch(response.status) {
                case 503:
                    alert("The chatroom service is currently offline")
                    disconnect()
                break

                case 429:
                    alert("You are sending messages too quickly")
                break

                default:
                    alert("Failed to send message")
                break
            }
            return
        }
        
        // render new message
        rendermessage(message)
        SEND_SOUND.play()
    }
})

nameinput.addEventListener('input', (e) => {
    let newname = e.target.value
    setname(newname)

    let lastspecial = usingspecial
    let special = checkifspecial(newname)
    if(special) {
        usingspecial = true

        console.log(special)
        seticon(special.icon)
    } else {
        usingspecial = false

        if(lastspecial) {
            seticon(getrandomicon())
        }
    }

    savestuff(name, icon)
})

iconselect.addEventListener("click", () => {
    if(usingspecial) return

    icon++
    icon %= (maxicon + 1)

    iconimg.src = formaticonid(icon)

    savestuff(name, icon)
})

// main heartbeat loop
async function pingserver() {
    try {
        const response = await fetch(CHATROOM_ENDPOINT + "/messages")

        if(!response.ok) {
            throw new Error("Network response was not ok")
        }

        const json = await response.json()
        const messages = json.messages
        const topic = json.topic

        if(topic !== knowntopic) {
            settopic(topic)
        }

        let addednew = false
        let notifsoundtoplay = RECIEVE_SOUND
        for(message of messages) {
            if(document.getElementById(message.id)) {
                continue
            }

            addednew = true
            rendermessage(message)
            let special = checkifspecial(message.name)
            if(special) {
                let thisnotifsound = special.getnotifsound()

                if(thisnotifsound !== RECIEVE_SOUND) {
                    notifsoundtoplay = thisnotifsound // will play the last special notif sound if one exists
                }
            }
        }

        if(addednew && loadedinitialmessages) {
            notifsoundtoplay.play()
        }
    } catch(e) {
        console.log(e)
        console.log("failed to pign server " + lastsuccessfulping)
        if(Date.now() - lastsuccessfulping > PING_INTERVAL * 5) {
            alert("Lost connection to chatroom server, refresh the tab?")
            disconnect()
        }
    }

    if(connected) {
        setTimeout(pingserver, PING_INTERVAL)
    }
}

async function init() {
    // load data
    if(savedataexists()) {
        let data = loadstuff()
        console.log(data)

        setname(data.name)
        seticon(data.icon)

        if(checkifspecial(data.name)) {
            usingspecial = true
        }
    } else {
        setname(generaterandomname())
        seticon(getrandomicon())
    }

    // start spinning the pinging
    await pingserver()
    loadedinitialmessages = true
}

init()