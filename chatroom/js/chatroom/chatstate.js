import { ROOT, TOPIC_DISPLAY } from './elements.js'
import { sendsystemmessage } from './messages.js'
import * as Sounds from './sounds.js'

const ONLINEROOT = document.getElementById("currentlyonline")

export var knowntopic = ""

export var connected = true
export var lastsuccessfulping = Date.now()

export var loadedinitialmessages = false

export const outgoingmessages = []
export var onlineusers = []

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
}

function setonlineusers(users) {
    onlineusers = users

    let toreplacewith = []
    for(const user of onlineusers) {
        let li = document.createElement("li")
        li.textContent = user

        toreplacewith.push(li)
    }

    ONLINEROOT.replaceChildren(...toreplacewith)
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
    setonlineusers,

    

    outgoingmessages,

    disconnect,
    settopic
}