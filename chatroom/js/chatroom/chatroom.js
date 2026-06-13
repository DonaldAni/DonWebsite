// constants
const CHATROOM_ENDPOINT = "https://phil.kayladotcom.org/donchatroom"
const PING_INTERVAL = 5000

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
import { rendermessage, doreply } from './messages.js'

// hooks
Elements.CHATBAR.addEventListener('keydown', async (e)=>{
    if(ChatState.connected && e.key === "Enter") {
        e.preventDefault()
        
        let text = Elements.CHATBAR.value.trim()
        if(text.trim().length === 0) {
            alert("You cannot send an empty message")
            return
        }
        Elements.CHATBAR.value = ""

        let id = crypto.randomUUID()
        
        if(Profile.name.length == 0) {
            Profile.setname(generaterandomname())
            savestuff(Profile.name, Profile.icon)
        }

        let replyid = null
        // ose was here
        if (text.startsWith("^")) {
            console.log("hi")
            let char = text.charAt(0)
            let i = 0
            let cancel = false
            while (char === "^") {
                if (i > 35) { // too much
                    cancel = true
                    break
                }
                i++
                char = text.charAt(i)
            }
            if (!cancel) {
                let msgs = Elements.HISTORY.querySelectorAll(".chat")
                let replyto = msgs[msgs.length-i]
                let chatmain = replyto.getElementsByClassName("chatmain")[0]

                replyid = replyto.getAttribute("id")
                // this is kind of disgusting but i'm sure its fine?
                name = chatmain.getElementsByTagName("p")[0].innerText.match(/<([^>]+)>/)[1] // i'll learn regex one day..
                text+=" (replying to "+name+")"

                doreply(replyid)
            }
        }

        console.log(Profile)
        let message = new Message(Profile.name, Profile.icon, text, MessageType.CHAT,replyid)
        
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
        let rendered = rendermessage(message)
        Elements.HISTORY.append(rendered.element)
        Elements.HISTORY.scrollTop = Elements.HISTORY.scrollHeight

        Sounds.SEND_SOUND.play()
    }
})

Elements.NAME_INPUT.addEventListener('input', (e) => {
    let newname = e.target.value
    Profile.setname(newname)

    let lastspecial = Profile.usingspecial
    let special = checkifspecial(newname)
    if(special) {
        Profile.usingspecial = true

        console.log(special)
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
            let rendered = rendermessage(message)
            Elements.HISTORY.append(rendered.element)
            Elements.HISTORY.scrollTop = Elements.HISTORY.scrollHeight

            let special = checkifspecial(message.name)
            if(special) {
                let thisnotifsound = special.getnotifsound()

                if(thisnotifsound !== Sounds.RECIEVE_SOUND) {
                    notifsoundtoplay = thisnotifsound // will play the last special notif sound if one exists
                }
            }

            let curtime = Date.now() / 1000
            let diff = (curtime-message.time) // something about this is super wrong and i dont wanna figure it out right now
            console.log(diff)
            if (message.replyid && diff < 15) {
                doreply(message.replyid)
            }
        }

        if(addednew && ChatState.loadedinitialmessages) {
            notifsoundtoplay.play()
        }

        ChatState.lastsuccessfulping = Date.now()
    } catch(e) {
        console.log(e)
        console.log("failed to pign server " + ChatState.lastsuccessfulping)
        if(Date.now() - ChatState.lastsuccessfulping > PING_INTERVAL * 5) {
            alert("Lost connection to chatroom server, refresh the tab?")
            disconnect()
        }
    }

    if(ChatState.connected) {
        setTimeout(pingserver, PING_INTERVAL)
    }
}

async function init() {
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

    // start spinning the pinging
    await pingserver()
    ChatState.loadedinitialmessages = true
}

init()