const SEND_SOUND = document.createElement("audio")
    SEND_SOUND.src = "sound/send.mp3"
const RECIEVE_SOUND = document.createElement("audio")
    RECIEVE_SOUND.src = "sound/recieve.mp3"
const NEW_TOPIC_SOUND = document.createElement("audio")
    NEW_TOPIC_SOUND.src = "sound/topic.mp3"

const CHATROOM_ENDPOINT = "https://phil.kayladotcom.org/donchatroom"
const PING_INTERVAL = 5000

let connected = true

// chat room elements
let root = document.getElementById("chatroomroot")

let nameinput = document.getElementById("chatroomnameinput")
let iconselect = document.getElementById("iconselect")
let iconimg = document.getElementById("selicon")

let history = document.getElementById("chatroomhistory")
let input = document.getElementById("chatroominput")

let topic = document.getElementById("philtopic")

// stuff
let specialnames = {
    "donaldani": -1,
    "ms_kaylaa": -2,
    "ukubabe": -3,
    "paint": -4
}
let specialclasses = {
    [-1]: 'donaldchat',
    [-2]: 'kaylachat',
    [-3]: 'ukubabechat',
    [-4]: 'paintchat',

    0: 'systemchat'
}

// funcs
function rendermessage(message) {
    /*
        <div id="chatroomhistory">
            <div class="chat">
                <div class="chatmain">
                    <img src="img/icons/icon1.png">
                    <p>&lt;examplename&gt; hi</p>
                </div>
                
                <div class="chatside">
                    <p class="time">12:00am</p>
                    <p class="time">12/12/12</p>
                </div>
            </div>
        </div>
    */
    let chat = document.createElement("div")
        chat.className = "chat"
        chat.id = message.id
    
    let chatmain = document.createElement("div")
        chatmain.className = "chatmain"
    
    let icon = document.createElement("img")
        icon.src = `img/icons/icon${message.icon + 1}.png`
        if(message.icon === -1) {
            // system message
            icon.src = "img/icons/iconphil.png"
        }
    let text = document.createElement("p")
        text.textContent = `<${message.name}> ${message.text}`
    
    let chatside = document.createElement("div")
        chatside.className = "chatside"
    
    if('time' in message) {
        let time = document.createElement("p")
            time.className = "time"
        let date = document.createElement("p")
            date.className = "time"
        
        let messageDate = new Date(message.time * 1000)
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
    }

    if((message.icon+1) in specialclasses) {
        let spclass = specialclasses[(message.icon+1)]
        
        chat.classList.add(spclass)
    }
    
    chat.append(chatmain, chatside)
    chatmain.append(icon, text)
    
    history.appendChild(chat)
}

function disconnect() {
    connected = false

    root.replaceChildren()

    let downnotice = document.createElement("p")
        downnotice.textContent = "lost connection: refresh the page"
        downnotice.className = "downnotice"

    root.appendChild(downnotice)
}

function savestuff(name, icon) {
    window.localStorage.setItem("chatroom-profile", JSON.stringify({
        name: name,
        icon: icon
    }))
}
function saveifnosaveexists(name, icon) {
    if(window.localStorage.getItem("chatroom-profile") === null) {
        savestuff(name, icon)
    }
}

function loadstuff() {
    let saved = window.localStorage.getItem("chatroom-profile")

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

// chat room vars
let nameadjectives = [
    "Smelly",
    "Loud",
    "Obnoxious",
    "Proud",
    "Egolicious",
    "Tuffmongus",
    "Beautiful"
]
let namenouns = [
    "Foot",
    "Priest",
    "Friend",
    "Feather",
    "Tuffmongus",
    "Stitch",
    "Robot",
    "Sphere",
    "Bottle",
    "Pen",
    "Phone"
]

let name
var adj = nameadjectives[Math.floor(Math.random() * nameadjectives.length)]
var noun = namenouns[Math.floor(Math.random() * namenouns.length)]
name = adj + noun

let icon = Math.floor(Math.random() * 5)

// load stuff if it exists
let loaded = loadstuff()
if(loaded !== undefined) {
    name = loaded.name
    icon = loaded.icon
}

// save the defaults
saveifnosaveexists(name, icon)

// set up the defaults
nameinput.value = name
iconimg.src = `img/icons/icon${icon + 1}.png`
history.scrollTop = history.scrollHeight

// set up interactions
input.addEventListener('keydown', async (e)=>{
    if(connected && e.key === "Enter") {
        e.preventDefault()
        
        let text = input.value.trim()
        if(text.length === 0) {
            alert("You cannot send an empty message")
            return
        }
        input.value = ""

        let id = crypto.randomUUID()
        
        if(name.length == 0) {
            var adj = nameadjectives[Math.floor(Math.random() * nameadjectives.length)]
            var noun = namenouns[Math.floor(Math.random() * namenouns.length)]
            name = adj + noun

            nameinput.value = name
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
        history.scrollTop = history.scrollHeight
    }
})

let usingspecial = false
nameinput.addEventListener('input', (e) => {
    name = e.target.value

    let usinglastspecial = usingspecial
    usingspecial = false
    for(special of Object.keys(specialnames)) {
        if(name.toLowerCase() === special) {
            icon = specialnames[special] - 1
            iconimg.src = `img/icons/icon${icon + 1}.png`

            usingspecial = true
        }
    }

    if(!usingspecial && usinglastspecial) {
        icon = 0
        iconimg.src = `img/icons/icon${icon + 1}.png`
    }

    savestuff(name, icon)
})

iconselect.addEventListener("click", () => {
    if(usingspecial) return
    icon = (icon + 1) % 9
    iconimg.src = `img/icons/icon${icon + 1}.png`

    savestuff(name, icon)
})


// how this is gonna work:
// when u send a message, it renders immediately
// every n seconds, ping the chatroom endpoint. 
let lastsuccessfulping = Date.now()
let loadedinitialmessages = false
let knowntopic = undefined

async function refreshmessages() {
    try {
        const response = await fetch(CHATROOM_ENDPOINT + "/messages")

        if(!response.ok) {
            throw new Error("Network response was not ok")
        }

        const json = await response.json()

        const messages = json.messages
        for(message of messages) {
            let added = false
            for(message of messages) {
                if(document.getElementById(message.id)) {
                    continue
                }
                console.log("found message that we havent added yet: " + message.text)
                added = true
                rendermessage(message)
            }
            
            if(added) {
                if(loadedinitialmessages) RECIEVE_SOUND.play()
                history.scrollTop = history.scrollHeight
            }
        }

        const newtopic = json.topic
        if(newtopic !== knowntopic) {
            topic.textContent = `CHAT TOPIC: ${newtopic}`

            knowntopic = newtopic
            if(loadedinitialmessages) {
                NEW_TOPIC_SOUND.play()

                rendermessage({
                    name: "SYSTEM",
                    icon: -1,
                    text: `CHAT TOPIC: "${newtopic}"`,
                    time: Date.now() / 1000
                })
                history.scrollTop = history.scrollHeight
            }
        }

        lastsuccessfulping = Date.now()
    } catch(e) {
        console.log("failed to pign server " + lastsuccessfulping)
        if(Date.now() - lastsuccessfulping > PING_INTERVAL * 5) {
            alert("Lost connection to chatroom server, refresh the tab?")
            disconnect()
        }
    }

    if(connected) {
        setTimeout(refreshmessages, PING_INTERVAL)
    }
}

async function init() {
    await refreshmessages()
    loadedinitialmessages = true
}

init()