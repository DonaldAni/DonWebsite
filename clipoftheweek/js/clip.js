const LOADING = document.getElementById("loading")
const WAIT_FOR_LOAD = document.getElementById("waitforload")

const WEEK = document.getElementById("week")
const CLIP = document.getElementById("clip")
const CLIP_SOURCE = document.getElementById("clipsrc")
const TITLE = document.getElementById("title")
const DESCRIPTION = document.getElementById("description")

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

let rawparams = window.location.search
let params = new URLSearchParams(rawparams)

let clip = params.get("clip")

fetch("clips.json")
    .then(result => result.json())
    .then(data => {
        let gottenclip = data[clip]
        if(!gottenclip) {
            LOADING.innerText = "ERROR GETTING CLIP! Are you sure it exists?"
            return
        }

        WEEK.innerText = gottenclip.week
        CLIP_SOURCE.src = `videos/${clip}`
        CLIP.load()
        TITLE.innerText = gottenclip.title
        DESCRIPTION.innerHTML = gottenclip.description

        if(gottenclip.tags) {
            processtags(gottenclip.tags)
        }

        LOADING.remove()
        document.getElementById("waitforload").id = ""
    })