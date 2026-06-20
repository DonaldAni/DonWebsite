import { WEBSOCKET_ENDPOINT, CHATROOM_ENDPOINT } from "./consts.js"

import Profile from "./profile.js"
import ChatState from './chatstate.js'
import * as Elements from './elements.js'
import Sounds from "./sounds.js"

import { Message, rendermessage, addrenderedmessage, loadhistory } from "./messages.js"
import { outgoingmessages } from "./chatstate.js"

import { savestuff } from "./save.js"
import { doreply } from "./messages.js"

export const socket = new WebSocket(
    WEBSOCKET_ENDPOINT
)

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

        case "history":
            loadhistory(payload.history)
            ChatState.settopic(payload.topic)
            ChatState.setonlineusers(payload.currentlyonline)

            ChatState.loadedinitialmessages = true
        break

        case "join":
            ChatState.setonlineusers(payload.currentlyonline)
        break

        case "ping":
            socket.send(JSON.stringify({
                event: "pong"
            }))
        break
    }
}

export function updateserverprofile(name, icon) {
    socket.send(JSON.stringify({
        event: "updateprofile",

        name,
        icon
    }))
}

export async function sendmessage(content, type) {
    let id = crypto.randomUUID()
    
    if(Profile.name.length == 0) {
        Profile.setname(generaterandomname())
        savestuff(Profile.name, Profile.icon)
    }
    
    let replyid = null
    // ose was here
    if (content.startsWith("^")) {
        let char = content.charAt(0)
        let i = 0
        let cancel = false
        while (char === "^") {
            if (i > 35) { // too much
                cancel = true
                break
            }
            i++
            char = content.charAt(i)
        }
        if (!cancel) {
            let msgs = Elements.HISTORY.querySelectorAll(".chat")
            let replyto = msgs[msgs.length-i]
            let chatmain = replyto.getElementsByClassName("chatmain")[0]
            
            replyid = replyto.getAttribute("id")
            // this is kind of disgusting but i'm sure its fine?
            name = chatmain.getElementsByTagName("p")[0].innerText.match(/<([^>]+)>/)[1] // i'll learn regex one day..
            content+=" (replying to "+name+")"
            
            doreply(replyid)
        }
    }
    
    console.log(Profile)
    let message = new Message(Profile.name, Profile.icon, content, type, replyid)
    
    let rendered = rendermessage(message)
                    .addclass("outgoing")

    addrenderedmessage(rendered)
    outgoingmessages.push(message.id)
    
    // const response = await fetch(CHATROOM_ENDPOINT + "/send", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(message)
    // })
    
    // if(!response.ok) {
    //     switch(response.status) {
    //         case 503:
    //         alert("The chatroom service is currently offline")
    //         ChatState.disconnect()
    //         socket.close()
    //         break
            
    //         case 429:
    //         alert("You are sending messages too quickly")
    //         break
            
    //         default:
    //         alert("Failed to send message")
    //         break
    //     }
    //     return
    // }

    socket.send(JSON.stringify({
        event: "chat",
        message: message
    }))
    
    Sounds.SEND_SOUND.play()
}