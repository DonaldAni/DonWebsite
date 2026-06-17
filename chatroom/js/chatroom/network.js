import { CHATROOM_ENDPOINT } from "./consts.js"

import Profile from "./profile.js"
import * as Elements from './elements.js'
import Sounds from "./sounds.js"

import { Message } from "./messages.js"
import { outgoingmessages } from "./chatstate.js"

import { savestuff } from "./save.js"
import { doreply } from "./messages.js"

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
    outgoingmessages.push(message.id)
    
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
            ChatState.disconnect()
            socket.close()
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
    // let rendered = rendermessage(message)
    // Elements.HISTORY.append(rendered.element)
    // Elements.HISTORY.scrollTop = Elements.HISTORY.scrollHeight
    
    Sounds.SEND_SOUND.play()
}