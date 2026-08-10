let mus = new Audio("sound/music.ogg")
mus.loop = true
mus.play()
    .catch(() => {
        window.addEventListener("pointerdown", () => {
            mus.play()
        })
    })

function aredevtoolsopen() {
    const threshold = 120

    const widthThreshold = globalThis.outerWidth - globalThis.innerWidth > threshold
	const heightThreshold = globalThis.outerHeight - globalThis.innerHeight > threshold

    return !(heightThreshold && widthThreshold)
        && ( widthThreshold || heightThreshold)
}

function removewoman() {
    if(!woman) {
        return
    }

    woman.style.opacity = "0%"
    woman.style.pointerEvents = "none"

    setTimeout(() => {
        woman.remove()
    }, 650)

    function addevent() {
        tree.style.pointerEvents = "auto"
        tree.addEventListener("click", () => {
            tree.style.pointerEvents = "none"
            startdialogue([
                "Shes gone, you should get going..."
            ], addevent)
        }, { once: true })
    }
    addevent()
}

function startdialogue(todraw, oncomplete) {
    if(document.getElementById("dialogue")) {
        return
    }

    let dialogue = document.createElement("div")
        dialogue.id = "dialogue"

        let text = document.createElement("p")
            text.textContent = "* "
                    
        let next = document.createElement("p")
            next.id = "dialoguenext"
            next.textContent = ">"
            next.style.display = "none"
                    
        dialogue.append(text)
        dialogue.append(next)

    document.getElementById("root").append(dialogue)
    dialogue.offsetHeight
    dialogue.style.opacity = "100%"

    let speed = 80
    let puncspeed = 400

    let idx = 0
    let pos = 0
    let queuenext = true

    let audio = new Audio("sound/tick.mp3")
    audio.volume = 0.25
    function typewrite() {
        let drawing = todraw[idx]
        let tospeed = speed

        if(queuenext && pos < drawing.length) {
            next.style.display = "none"

            let letterdrawn = drawing.charAt(pos)
            if(letterdrawn == "." || letterdrawn == ",") {
                tospeed = puncspeed
            }

            text.textContent = "* " + drawing.substring(0, pos+1)

            pos++
            audio.pause()
            audio.currentTime = 0
            audio.play()
            setTimeout(typewrite, tospeed)
        } else if(next.style.display == "none") {
            next.style.display = "block"

            next.addEventListener("click", () => {
                if(idx != todraw.length-1) {
                    pos = 0
                    idx++

                    typewrite()
                } else {
                    queuenext = false
                    dialogue.style.opacity = "0%"
                    next.style.display = "none"
                    oncomplete()

                    setTimeout(() => {
                        dialogue.remove()
                    }, 650)
                }
            }, { once: true })
        }
    }
    setTimeout(() => {
        typewrite()
    }, 650)
}

const woman = document.getElementById("woman")
woman.addEventListener("click", (e) => {
    woman.style.pointerEvents = "none"
    startdialogue([
        "Well, there is a woman here.",
        "You aren't supposed to be here, aren't you."
        //"a"
    ], removewoman)
}, { once: true })

const checkinterval = 200
let check = () => {
    if(aredevtoolsopen() && woman) {
        removewoman()
    } else {
        setTimeout(check, checkinterval)
    }
}
setTimeout(check, checkinterval)

if(localStorage.getItem("seenpagebetween")) {
    woman.remove()
    window.close()
}
localStorage.setItem("seenpagebetween", "true")