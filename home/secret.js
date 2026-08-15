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

let loadedsecrets = false
async function loadsecrets() {
    var seensofar = window.localStorage.getItem("secrets")
    if(seensofar === null) seensofar = "[]"
            
    var parsed = JSON.parse(seensofar)
    console.log(parsed)

    for(seen of [...parsed]) {
        let res = await fetch(seen.target)
        if(!res.ok) {
            console.log("removing invalid secret")
            parsed.splice(parsed.indexOf(seen), 1)
            continue
        }

        let li = document.createElement("li")
        let a = document.createElement("a")
        a.href = seen.target
        a.innerHTML = seen.key

        li.appendChild(a)
        secretsfound.appendChild(li)
    }

    localStorage.setItem("secrets", JSON.stringify(parsed))
    loadedsecrets = true
}
loadsecrets()

secretbutton.addEventListener("click", async () => {
    console.log(loadedsecrets)
    if(!loadedsecrets) {
        return
    }

    var input = secretinput.value

    var res = await fetch(`https://donaldapi.kayladotcom.org/verifysecret/${input}`)
    res = await res.json()

    if(res.valid) {
        var seensofar = window.localStorage.getItem("secrets")
        if(seensofar === null) seensofar = "[]"
        
        var parsed = JSON.parse(seensofar)
        var found = false

        for(seen of parsed) {
            if(seen.key == input) {
                found = true
                break
            }
        }
        if(!found) {
            console.log("thats a new one")
            parsed.push({key: input, target: res.result})

            window.localStorage.setItem("secrets", JSON.stringify(parsed))
        }

        window.location.href = res.result
    } else {
        erraudio.currentTime = 0
        erraudio.play()
        err.style.visibility = "visible"
        setTimeout(function() {
            err.style.visibility = "hidden"
        }, 2000)
    }
})