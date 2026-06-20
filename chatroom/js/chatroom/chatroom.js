// constants
import { WEBSOCKET_ENDPOINT, CHATROOM_ENDPOINT, PING_INTERVAL, TIMEOUT_THRESHOLD } from './consts.js'

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
import { sendmessage, updateserverprofile, socket } from './network.js'

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
    updateserverprofile(Profile.name, Profile.icon)
})

Elements.ICON_SELECT.addEventListener("click", () => {
    if(Profile.usingspecial) return

    Profile.seticon((Profile.icon+1) % (MAX_ICON_ID + 1))

    Elements.ICON_IMG.src = formaticonid(icon)

    savestuff(Profile.name, Profile.icon)
    updateserverprofile(Profile.name, Profile.icon)
})

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

// wait for the socket to finish connecting
socket.addEventListener('open', () => {
    socket.send(JSON.stringify({
        event: "join",

        name: Profile.name,
        icon: Profile.icon
    }))
})