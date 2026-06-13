import { formaticonid } from './icons.js'
import { name } from './profile.js'

import { checkifspecial } from './specialnames.js'

function sanitizetextHTMLsafe(text) {
    return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

export const MessageType = Object.freeze({
    CHAT : 'chat',
    ACTION : 'action',
    SYSTEM : 'system'
})

export class Message {
    constructor(name, icon, content, type,replyid=null) {
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
        if(this.name) {
            if(this.name !== name) {
                toset = toset.replaceAll(name, `<span style="color: yellow;">${name}</span>`)
            }

            toset = sanitizetextHTMLsafe(`<${this.name}>`) + ` ${toset}`
        }

        text.innerHTML = toset
        this.chatmain.append(text)

        return this
    }

    setcolor(color) {
        this.element.style = `
            color: ${color};
            border-bottom: 1px dashed ${color};
        `

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

export function rendermessage(message) {
    switch(message.type) {
        case MessageType.CHAT:
            return renderchat(message)
        break

        case MessageType.SYSTEM:
            return rendersystem(message)
        break

        default:
            return renderchat(message)
        break
    }
}
import { HISTORY } from './elements.js'
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