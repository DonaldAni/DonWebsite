const secrets = {
    "cGlhbm8=": "L3BpYW5v",
    "Y2xpcG9mdGhld2Vlaw==": "L2NsaXBvZnRoZXdlZWs=",
    "Yml0": "L2JpdA=="
}

secretpanel = document.getElementById("slideup")
secretinput = document.getElementById("secretinput")
secretbutton = document.getElementById("secretbutton")
err = document.getElementById("err")

erraudio = document.createElement("audio")
erraudio.src = "sound/no.mp3"

var soundup = document.createElement("audio")
soundup.src = "sound/secret/up.wav"
secretpanel.appendChild(soundup)

var sounddown = document.createElement("audio")
sounddown.src = "sound/secret/down.wav"
secretpanel.appendChild(sounddown)

secretpanel.addEventListener("mouseenter", () => {
    soundup.currentTime = 0
    soundup.play()
})
secretpanel.addEventListener("mouseleave", () => {
    sounddown.currentTime = 0
    sounddown.play()
})

secretsfound = document.getElementById("secretsfound")
var seensofar = window.localStorage.getItem("seensecrets")
if(seensofar === null) seensofar = ""
        
var split = seensofar.split(",")
split.pop()
console.log(split)

for(seen of split) {
    let li = document.createElement("li")
    let a = document.createElement("a")
    a.href = atob(secrets[seen])
    a.innerHTML = atob(seen)

    li.appendChild(a)
    secretsfound.appendChild(li)
}


secretbutton.addEventListener("click", () => {
    var input = btoa(secretinput.value)

    if(input in secrets) {
        console.log(input)

        var seensofar = window.localStorage.getItem("seensecrets")
        if(seensofar === null) seensofar = ""
        
        var split = seensofar.split(",")
        split.pop()

        if(!split.includes(input)) {
            console.log("thats a new one")
            seensofar += `${input},`

            window.localStorage.setItem("seensecrets", seensofar)
        }

        window.location.href = atob(secrets[input])
    } else {
        erraudio.currentTime = 0
        erraudio.play()
        err.style.visibility = "visible"
        setTimeout(function() {
            err.style.visibility = "hidden"
        }, 2000)
    }
})