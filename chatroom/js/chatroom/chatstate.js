import { ROOT, TOPIC_DISPLAY } from './elements.js'
import { sendsystemmessage } from './messages.js'
import * as Sounds from './sounds.js'

export var knowntopic = ""

export var connected = true
export var lastsuccessfulping = Date.now()

export var loadedinitialmessages = false

export const outgoingmessages = []

export function disconnect() {
    connected = false

    ROOT.replaceChildren()

    let downnotice = document.createElement("p")
        downnotice.textContent = "lost connection: refresh the page"
        downnotice.className = "downnotice"

    ROOT.appendChild(downnotice)
}

function settopic(newtopic) {
    knowntopic = newtopic
    
    let topicstr = `CHAT TOPIC: ${newtopic}`
    TOPIC_DISPLAY.textContent = topicstr
    
    if(loadedinitialmessages) {
        Sounds.NEW_TOPIC_SOUND.play()
    }
}

export default {
    get knowntopic() {
        return knowntopic
    },
    get connected() {
        return connected
    },
    get loadedinitialmessages() {
        return loadedinitialmessages
    },
    set loadedinitialmessages(val) {
        loadedinitialmessages = val
    },
    get lastsuccessfulping() {
        return lastsuccessfulping
    },
    set lastsuccessfulping(val) {
        lastsuccessfulping = val
    },
    

    outgoingmessages,

    disconnect,
    settopic
}