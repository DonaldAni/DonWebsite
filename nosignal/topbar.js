class Social {
    constructor(img, link) {
        this.img = img
        this.link = link
    }
}

// social links
let toadd = [
    new Social("home", "/home"),
]

// marquee texts
// could hide secret strings in here
let canpick = [
    "NO SIGNAL"
]

var hoversound = document.createElement("audio")
hoversound.src = "/shared/sound/hover.wav"
hoversound.volume = 0.4
document.body.appendChild(hoversound)
class SocialLink extends HTMLElement {
    connectedCallback() {
        const img = this.getAttribute("img")
        const link = this.getAttribute("link")

        let ael = document.createElement("a")
        ael.href = link
        if(!localStorage.getItem("seenpagebetween")) {
            ael.addEventListener("click", function(e) {
                let chance = 0/50 // too lazy to try and remove it, so just make it impossible on this one
                let rolled = Math.random() <= chance

                if(rolled) {
                    window.open("/pagebetween", "_blank")
                }
            })
        }

        ael.addEventListener("mouseenter", function() {
            hoversound.currentTime = 0
            hoversound.play()
        })
        
        let imgel = document.createElement("img")
        imgel.src = `/shared/img/socials/${img}.gif`
        imgel.className = "topbaricon"
        ael.appendChild(imgel)

        this.appendChild(ael)
    }
}
customElements.define("social-link", SocialLink)

class TopBar extends HTMLElement {
    connectedCallback() {
        this.outerHTML = `
        <div class="topbar" id="topbar">
            
            <div class="topbaricons" id="topbaricons"></div>

            <div class="scrollingcontainer">
                <marquee id="marq" scrollamount="8">
                    frick
                </marquee>
            </div>
        </div>
        <br><br><br>

        `

        let marq = document.getElementById("marq")
                    
        let topick = Math.floor(Math.random() * canpick.length)
        let picked = canpick[topick]
        marq.innerHTML = picked
    }
}
customElements.define("top-bar", TopBar)

var style = document.createElement("link")
style.rel = "stylesheet"
style.href = "/shared/css/topbar.css"
document.head.appendChild(style)

let topbar = document.createElement("top-bar")
document.body.prepend(topbar)

let topbaricons = document.getElementById("topbaricons")

for(social of toadd) {
    let sociallink = document.createElement("social-link")
    sociallink.setAttribute("img", social.img)
    sociallink.setAttribute("link", social.link)

    topbaricons.appendChild(sociallink)
}

document.documentElement.lang = "en" // zalgo text makes it think its vietnamese