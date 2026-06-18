// constants
import { CHATROOM_ENDPOINT, PING_INTERVAL, TIMEOUT_THRESHOLD } from './consts.js'

// sounds
import * as Sounds from './sounds.js'

// chat room elements
import * as Elements from './elements.js'

// special name stuff
import { namemap, checkifspecial } from './specialnames.js'

// chatroom vars
import Profile from './profile.js'
import ChatState from './chatstate.js'
import { savedataexists, savestuff, loadstuff } from './save.js'

import { generaterandomname } from './names.js'
import { getrandomicon, MAX_ICON_ID } from './icons.js'

// message stuff
import { MessageType, Message, SystemMessage } from './messages.js'
import Commands from './commands.js'
import { rendermessage, addrenderedmessage } from './messages.js'
import { sendmessage } from './network.js'

// load data
if(savedataexists()) {
    let data = loadstuff()
    console.log(data)
    
    Profile.setname(data.name)
    Profile.seticon(data.icon)
    
    if(checkifspecial(data.name)) {
        Profile.usingspecial = true
    }
} else {
    Profile.setname(generaterandomname())
    Profile.seticon(getrandomicon())
}

// hooks
const socket = new WebSocket(
    "wss://phil.kayladotcom.org/donchatroom/ws"
)
// socket.onopen = function() {
//     let payload = {
//         event: 'join',

//         name: Profile.name
//     }

//     socket.send(JSON.stringify(payload))
// }

socket.onmessage = function(payload) {
    let raw = payload
    payload = JSON.parse(payload.data)

    ChatState.lastsuccessfulping = Date.now()
    console.log(ChatState.lastsuccessfulping, payload)

    switch(payload.event) {
        case "chat":
            let message = payload.message

            if(document.getElementById(message.id)) {
                if(ChatState.outgoingmessages.includes(message.id)) {
                    // remove outgoing tag
                    let rendered = document.getElementById(message.id)
                    rendered.classList.remove("outgoing")
                }

                return
            }

            addrenderedmessage(rendermessage(message))

            let notifsound = Sounds.RECIEVE_SOUND
            let special = checkifspecial(message.name)
            if(special) {
                notifsound = special.getnotifsound()
            }
            if(message.system) {
                notifsound = Sounds.SYSTEM_RECIEVE_SOUND
            }

            let curtime = Date.now() / 1000
            let diff = (curtime-message.time) // something about this is super wrong and i dont wanna figure it out right now

            if (message.replyid && diff < 15) {
                doreply(message.replyid)
            }

            if(!ChatState.outgoingmessages.includes(message.id)) {
                notifsound.play()
            } else {
                ChatState.outgoingmessages.splice(ChatState.outgoingmessages.indexOf(message.id), 1)
            }
        break

        case "newtopic":
            if(payload.topic !== ChatState.knowntopic) {
                ChatState.settopic(payload.topic)
            }
        break

        case "ping":
            socket.send(JSON.stringify({
                event: "pong"
            }))
        break
    }
}

Elements.CHATBAR.addEventListener('keydown', async (e)=>{
    if(ChatState.connected && e.key === "Enter") {
        e.preventDefault()
        
        let text = Elements.CHATBAR.value.trim()
        if(text.trim().length === 0) {
            alert("You cannot send an empty message")
            return
        }
        Elements.CHATBAR.value = ""

        if(!text.startsWith("/")) {
            // normal message
            await sendmessage(text, MessageType.CHAT)
        } else {
            // command
            let command = text.slice(1).split(" ")[0]
            let args = text.slice(1).split(" ").slice(1)

            for(const cmd of Commands) {
                if(cmd.key === command) {
                    cmd.run(args)
                    return
                }
            } 
        }
    }
})

Elements.NAME_INPUT.addEventListener('input', (e) => {
    let newname = e.target.value
    Profile.setname(newname)

    let lastspecial = Profile.usingspecial
    let special = checkifspecial(newname)
    if(special) {
        Profile.usingspecial = true

        Profile.seticon(special.icon)
    } else {
        Profile.usingspecial = false

        if(lastspecial) {
            Profile.seticon(getrandomicon())
        }
    }

    savestuff(Profile.name, Profile.icon)
})

Elements.ICON_SELECT.addEventListener("click", () => {
    if(Profile.usingspecial) return

    Profile.seticon((Profile.icon+1) % (MAX_ICON_ID + 1))

    Elements.ICON_IMG.src = formaticonid(icon)

    savestuff(Profile.name, Profile.icon)
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

        if(topic !== ChatState.knowntopic) {
            ChatState.settopic(topic)
        }

        let addednew = false
        let notifsoundtoplay = Sounds.RECIEVE_SOUND
        for(const message of messages) {
            if(document.getElementById(message.id)) {
                continue
            }

            addednew = true
            addrenderedmessage(rendermessage(message))

            if(message.system) {
                notifsoundtoplay = Sounds.SYSTEM_RECIEVE_SOUND
            }

            let special = checkifspecial(message.name)
            if(special && notifsoundtoplay !== Sounds.SYSTEM_RECIEVE_SOUND) {
                let thisnotifsound = special.getnotifsound()

                if(thisnotifsound !== Sounds.RECIEVE_SOUND) {
                    notifsoundtoplay = thisnotifsound // will play the last special notif sound if one exists
                }
            }

            let curtime = Date.now() / 1000
            let diff = (curtime-message.time) // something about this is super wrong and i dont wanna figure it out right now

            if (message.replyid && diff < 15) {
                doreply(message.replyid)
            }
        }

        if(addednew && ChatState.loadedinitialmessages) {
            notifsoundtoplay.play()
        }

        ChatState.lastsuccessfulping = Date.now()
    } catch(e) {
        console.error(e)
        console.log("failed to pign server " + ChatState.lastsuccessfulping)
        if(Date.now() - ChatState.lastsuccessfulping > PING_INTERVAL * 5) {
            console.log("disconnecting because of failed ping")
            alert("Lost connection to chatroom server, refresh the tab?")

            ChatState.disconnect()
            socket.close()
        }
    }
}

async function init() {
    // get history
    await pingserver()
    ChatState.loadedinitialmessages = true
}
 
init()

function checkfordisconnect() {
    let diff = Date.now() - ChatState.lastsuccessfulping
    if(diff > TIMEOUT_THRESHOLD) {
        console.log("disconnecting because of failed ping: " + diff)
        alert("Lost connection to chatroom server, refresh the tab?")

        ChatState.disconnect()
        socket.close()
    }

    if(ChatState.connected) {
        setTimeout(checkfordisconnect, 1000)
    }
}
checkfordisconnect()