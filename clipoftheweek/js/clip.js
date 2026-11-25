// loading elements
const LOADING = document.getElementById("loading")
const WAIT_FOR_LOAD = document.getElementById("waitforload")

// clip elements
const TIMEFRAME = document.getElementById("timeframe")
const TITLE_TIMEFRAME = document.getElementById("title-timeframe")
const WEEK = document.getElementById("week")

const CLIP = document.getElementById("clip")
const CLIP_SOURCE = document.getElementById("clipsrc")
const FEATURING = document.getElementById("ft")

const TITLE = document.getElementById("title")
const DESCRIPTION = document.getElementById("description")

// tag stuff
const tageffects = {
    "kayla": () => {
        const color = "#FF5B9F"

        TITLE.style.color = color
        DESCRIPTION.style.color = color
    }
}
function processtags(tags) {
    for(const tag of tags) {
        let effect = tageffects[tag]
        if(effect) {
            effect()
        }
    }
}

// get clip from url
let rawparams = window.location.search
let params = new URLSearchParams(rawparams)

let clip = params.get("clip")

function lookforclipdata(data) {
    let gottenclip = data[clip]
    if(!gottenclip) {
        throw new Error("could not find clip")
    }

    CLIP_SOURCE.src = `videos/${clip}`
    CLIP.load()

    TITLE.innerText = gottenclip.title
    DESCRIPTION.innerHTML = gottenclip.description

    if(!gottenclip.year) {
        WEEK.innerText = gottenclip.week
    } else {
        TITLE_TIMEFRAME.innerText = "YEAR"
        TIMEFRAME.innerText = "year"

        WEEK.innerText = gottenclip.year
    }

    if(gottenclip.tags) {
        processtags(gottenclip.tags)
    }
    if(gottenclip.featuring) {
        for(const person of gottenclip.featuring) {
            let pfp = document.createElement("img")
                pfp.src = `pfps/${person}.png`

            FEATURING.append(pfp)
        }
    }

    LOADING.remove()
    document.getElementById("waitforload").id = ""
}

// load clip from json
async function load() {
    let clipres = await fetch("clips.json")
    let clipdata = await clipres.json()

    try {
        lookforclipdata(clipdata)
    } catch(e) {
        let cotyres = await fetch("clipsoftheyears.json")
        let cotydata = await cotyres.json()

        try {
            lookforclipdata(cotydata)
        } catch(e) {
            LOADING.innerText = "ERROR GETTING CLIP! Are you sure it exists?"
        }
    }
}
load()