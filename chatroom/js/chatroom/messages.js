import { formaticonid } from './icons.js'
import { name } from './profile.js'

import { checkifspecial } from './specialnames.js'
import { loadedinitialmessages } from './chatstate.js'

import ChatState from './chatstate.js'
import Sounds from './sounds.js'

function sanitizetextHTMLsafe(text) {
    return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

export const MessageType = Object.freeze({
    CHAT : 'chat',
    ACTION : 'action',
    SYSTEM : 'system'
})

export class Message {
    constructor(name, icon, content, type, replyid=null) {
        this.name = name
        this.content = content
        this.icon = icon
        this.replyid = replyid

        this.type = type
        
        this.id = crypto.randomUUID()
        this.time = Date.now() / 1000
    }

    static fromMessageStruct(msgstruct) {
        let msg = new Message(msgstruct.name, msgstruct.icon, msgstruct.content, msgstruct.type)
            msg.id = msgstruct.id
            msg.time = msgstruct.time
    }
}
export class SystemMessage extends Message {
    constructor(content) {
        super('SYSTEM', 'phil', content, MessageType.SYSTEM)
        
        this.system = true
    }
}

class RenderedMessage {
    constructor() {
        this.element = document.createElement('div')
            this.element.className = 'chat'
            
            this.chatmain = document.createElement('div')
                this.chatmain.className = 'chatmain'

            this.chatside = document.createElement('div')
                this.chatside.className = 'chatside'

        this.element.append(this.chatmain, this.chatside)

        this.name = undefined
    }

    setid(id) {
        this.element.id = id

        return this
    }

    addicon(icon) {
        let iconele = document.createElement('img')
            iconele.src = formaticonid(icon)

        this.chatmain.prepend(iconele)

        return this
    }

    settime(time) {
        let timep = document.createElement('p')
            timep.className = 'time'
        let datep = document.createElement('p')
            datep.className = 'time'

        let date = new Date(time * 1000)
        this.time = date.getTime()

        timep.textContent = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
        datep.textContent = date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit'
        })

        this.chatside.append(timep)
        this.chatside.append(datep)

        return this
    }

    setreplyid(replyid) {
        this.replyid = replyid

        return this
    }

    setcontent(content) {
        let text
        
        let existingtext = this.chatmain.querySelector('p')
        if(existingtext) {
            text = existingtext
            text.innerHTML = ''
        } else {
            text = document.createElement('p')
        }

        let toset = sanitizetextHTMLsafe(content)
        let mentioned = false
        if(this.name) {
            if(this.name !== name) {
                let oldtoset = toset

                let regex = new RegExp(name, 'gi')
                toset = toset.replaceAll(regex, `<span style="color: yellow;">${name}</span>`)
            
                if(toset !== oldtoset && loadedinitialmessages) {
                    sounds.MENTIONED_SOUND.play()
                }
            }

            toset = sanitizetextHTMLsafe(`<${this.name}>`) + ` ${toset}`
        }

        text.innerHTML = toset
        this.chatmain.append(text)

        return this
    }

    setcolor(color) {
        this.element.style.color = color
        this.element.style.borderBottom = `1px dashed ${color}`

        return this
    }

    setname(name) {
        this.name = name

        let special = checkifspecial(name)
        if(special) {
            this.setcolor(special.color)
        }

        return this
    }

    addclass(cssclass) {
        this.element.classList.add(cssclass)

        return this
    }
    removeclass(cssclass) {
        this.element.classList.remove(cssclass)

        return this
    }
}

function renderchat(messagedata) {
    let rendered = 
        new RenderedMessage()
            .setname(messagedata.name)
            .settime(messagedata.time)
            .setreplyid(messagedata.replyid)
            .setcontent(messagedata.content)
            .addicon(messagedata.icon)
            .setid(messagedata.id)
    
    return rendered
}

function rendersystem(messagedata) {
    let rendered = 
        renderchat(messagedata)
            .setcolor('#FF3FEE')

    return rendered
}

function renderaction(messagedata) {
    let rendered = 
        new RenderedMessage()
            .settime(messagedata.time)
            .setreplyid(messagedata.replyid) // shouldnt ever come into effect but whateverrrr
            .setcontent(`* ${messagedata.name} ${messagedata.content} *`)
            .setname(messagedata.name) // happens after to not add it onto the start of the content
            .setid(messagedata.id)
    
    rendered.chatmain.classList.add("me")

    return rendered
}

export function rendermessage(message) {
    switch(message.type) {
        case MessageType.CHAT:
            return renderchat(message)
        break

        case MessageType.SYSTEM:
            return rendersystem(message)
        break

        case MessageType.ACTION:
            return renderaction(message)
        break

        default:
            return renderchat(message)
        break
    }
}
import { HISTORY } from './elements.js'
import sounds from './sounds.js'

export function addrenderedmessage(renderedmessage) {
    HISTORY.append(renderedmessage.element)

    HISTORY.scrollTop = HISTORY.scrollHeight
}

export function doreply(replyid) {
    let replymsg = document.getElementById(replyid)
    setTimeout(function() {
        replymsg.getElementsByTagName("p")[0].animate([
            { 
                color: "yellow",
            },
            { 
                color: window.getComputedStyle(replymsg).getPropertyValue("color"),
            }
        ], {
            duration : 800,
            iterations: 5
        })

        replymsg.getElementsByTagName("p")[0].animate([
            { transform: "rotate(0deg)" },
            { transform: "rotate(-1deg)" },
            { transform: "rotate(1deg)" },
            { transform: "rotate(-1deg)" },
            { transform: "rotate(1deg)" },
            { transform: "rotate(0deg)" },
        ], {
            easing: "ease-in-out",
            duration : 800,
            iterations: 5
        })
    },1)

}

export function sendsystemmessage(content) {
    let message = new SystemMessage(content)
    let rendered = rendermessage(message)

    HISTORY.append(rendered.element)
    HISTORY.scrollTop = HISTORY.scrollHeight
}

export function loadhistory(arr) {
    let addednew = false
    let notifsoundtoplay = Sounds.RECIEVE_SOUND
    for(const message of arr) {
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
}