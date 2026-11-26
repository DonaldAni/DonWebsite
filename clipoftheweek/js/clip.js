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

// utils
async function imageExists(src) {
    try {
        const res = await(fetch(src, { method: 'HEAD' }))
        return res.ok
    } catch(e) {
        return false
    }
}

// get clip from url
let rawparams = window.location.search
let params = new URLSearchParams(rawparams)

let clip = params.get("clip")

async function lookforclipdata(data) {
    console.log(data, clip)
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
        TITLE_TIMEFRAME.classList.add("coty-gradient", "coty-title")

        TIMEFRAME.innerText = "year"

        WEEK.innerText = gottenclip.year
    }

    if(gottenclip.tags) {
        processtags(gottenclip.tags)
    }
    if(gottenclip.featuring && false) {
        for(const person of gottenclip.featuring) {
            let pfpsrc = `pfps/${person}.png`

            let pfp = document.createElement("img")
                pfp.src = (await imageExists(pfpsrc)) ? pfpsrc : 'pfps/default.png'
                pfp.title = `This clip features ${person.charAt(0).toUpperCase() + person.slice(1)}`

            FEATURING.append(pfp)
        }
    } else {
        document.getElementById("ftgroup").remove()
    }

    LOADING.remove()
    document.getElementById("waitforload").id = ""
}

// load clip from json
async function load() {
    let clipres = await fetch("clips.json")
    let clipdata = await clipres.json()

    try {
        await lookforclipdata(clipdata)
    } catch(e) {
        console.warn(`failed to get clip: ${e}\ntrying coty list`)

        let cotyres = await fetch("clipsoftheyears.json")
        let cotydata = await cotyres.json()

        try {
            await lookforclipdata(cotydata)
        } catch(e) {
            console.warn(e)
            LOADING.innerText = "ERROR GETTING CLIP! Are you sure it exists?"
        }
    }
}
load()