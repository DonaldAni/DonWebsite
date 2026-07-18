const UNSEEN_KEY = "unseen"
function loadunseen() {
    return JSON.parse(localStorage.getItem(UNSEEN_KEY))
}
function saveunseen(newdata) {
    localStorage.setItem(UNSEEN_KEY, JSON.stringify(newdata))
}

function getdurationofvideo(filename) {
    return new Promise((resolve, reject) => {
        let video = document.createElement("video")
        video.src = `videos/${filename}`

        video.addEventListener("loadedmetadata", () => {
            resolve(video.duration)
        })

        video.addEventListener("error", () => {
            reject(new Error("Failed to load video metadata"))
        })
    })
}
function formatvideoduration(duration) {
    let seconds = Math.floor(duration % 60)
    let minutes = Math.floor((duration / 60) % 60)

    seconds = seconds.toString()
    while(seconds.length < 2) {
        seconds = "0" + seconds
    }

    return `${minutes}:${seconds}`
}

const LOADING_TEXT = document.getElementById("loading")
const CARD_CONTAINER = document.getElementById("cardcontainer")

class VideoCard extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.doit()
    }

    async doit() {
        this.thumbnail = this.getAttribute("thumbnail")
        this.week = this.getAttribute("week")
        this.title = this.getAttribute("title")
        this.goesto = this.getAttribute("goesto")
        this.latest = this.getAttribute("latest") === "true"
    
        let card = document.createElement("div")
            card.className = "card"

            let thumbnailholder = document.createElement("div")
                thumbnailholder.className = "thumbnailholder"

                let stupid = document.createElement("div")
                    stupid.style.position = "relative"

                    let thumbnail = document.createElement("img")
                        thumbnail.className = "thumbnail"
                        thumbnail.src = `thumbnails/${this.thumbnail}`
                        if(this.latest) {
                            thumbnail.style.border = "2px solid yellow"
                        }

                    stupid.appendChild(thumbnail)
                    if(this.latest) {
                        let latesttag = document.createElement("img")
                            latesttag.className = "latesttag"
                            latesttag.src = "img/new.png"

                        stupid.appendChild(latesttag)
                    }
                thumbnailholder.appendChild(stupid)
            
            let titlebar = document.createElement("div")
                titlebar.className = "titlebar"
                
                let title = document.createElement("h2")
                    title.textContent = `WEEK OF ${this.week}`
                    if(this.latest) {
                        title.style.color = "yellow"
                    }

                let duration = document.createElement("p")
                    duration.className = "duration"
                    duration.innerText = formatvideoduration(await getdurationofvideo(this.goesto))
                
                    if(this.latest) {
                        duration.style.color = "yellow"
                    }

                titlebar.appendChild(title)
                titlebar.appendChild(duration)

            let subtitle = document.createElement("p")
                subtitle.className = "subtitle"
                subtitle.textContent = this.title

                if(this.latest) {
                    subtitle.style.color = "orange"
                }

            card.appendChild(thumbnailholder)
            card.appendChild(titlebar)
            card.appendChild(subtitle)

        this.appendChild(card)
        this.addEventListener("click", () => {
            let unseen = loadunseen()
            if(unseen.includes(this.goesto)) {
                unseen = unseen.filter(x => x !== this.goesto)
            }
            saveunseen(unseen)

            window.location.href = `clip.html?clip=${this.goesto}`
        })
    }
}

customElements.define("video-card", VideoCard)

fetch("clips.json")
    .then(response => response.json())
    .then(data => {
        if(!localStorage.getItem(UNSEEN_KEY)) {
            let newestkey = Object.keys(data)[0]

            localStorage.setItem(UNSEEN_KEY, JSON.stringify([newestkey]))
        }

        let unseen = loadunseen()

        for(const clipkey of Object.keys(data)) {
            let clipdata = data[clipkey]

            let card = document.createElement("video-card")
                card.setAttribute("thumbnail", clipdata.thumbnail)
                card.setAttribute("week", clipdata.week)
                card.setAttribute("title", clipdata.title)

                let isunseen = unseen.includes(clipkey)
                card.setAttribute("latest", isunseen)

                card.setAttribute("goesto", clipkey)

            CARD_CONTAINER.appendChild(card)
        }

        LOADING_TEXT.remove()
    })