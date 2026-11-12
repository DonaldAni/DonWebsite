const PIANO_DATA_KEY = "pianodata"
const PIANO_DATA = JSON.parse(window.localStorage.getItem(PIANO_DATA_KEY) ?? JSON.stringify({
    "autoplay": false,
    "looponce": false,

    "shuffle": false,
    "loop": false
}))

var piano = document.getElementById("piano")
var songname = document.getElementById("songname")

var playing = false
let curplaybutton = null
var audio = document.createElement("audio")

const canplay = [
    "sound/piano1.mp3",
    "sound/piano2.mp3",
    "sound/piano3.mp3",
    "sound/piano4.mp3",
    "sound/piano5.mp3",
    "sound/piano6.mp3",
    "sound/piano7.mp3",
    "sound/piano8.mp3",
    "sound/piano9.mp3",
    "sound/piano10.mp3",
    "sound/piano11.mp3",
    "sound/piano12.mp3",
    "sound/piano13.mp3",
    "sound/piano14.mp3",
    "sound/piano15.mp3",
    "sound/piano16.mp3"
]

const songnames = [
    "Don't Come Back",
    "Lamp",
    "Cinemassacre",
    "What Kind Of Fool Am I?",
    "Ladyfingers",
    "A Star is Born!",
    "Beautiful Boy",
    "Seizure",
    "Movin' Out",
    "Beebo's Theme",
    "Enjoy Your Stay",
    "Eight Melodies (Mother 1)",
    "Eight Melodies (Mother 2/Earthbound)",
    "Love Theme (Mother 3)",
    "A WAY OUT",
    "Return of The Mack"
]

const serieses = [
    "exe",
    "fnffd",
    "fnffd",
    "misc",
    "misc",
    "fnffd",
    "misc",
    "misc",
    "misc",
    "r64",
    "mother",
    "mother",
    "mother",
    "mother",
    "awayout",
    "misc"
]

function populatesonglist() {
    const SONG_LIST = document.getElementById("songlist")

    let i = 0
    for(const songname of songnames) {
        /*
        <div class="songentry">
            <div class="playcontainer">
                <img src="img/play.png">
            </div>
            <div class="songdetails">
                <p>aahghh</p>
            </div>
        </div>
        <div class="separator"></div>
        */

        let songentry = document.createElement("div")
            songentry.id = i
            songentry.className = "songentry"

            let playcontainer = document.createElement("div")
                playcontainer.className = "playcontainer"

                let playbutton = document.createElement("img")
                    playbutton.src = "img/play.png"

                    const ii = i
                    playbutton.addEventListener("click", function() {
                        play(ii)
                    })
                playcontainer.append(playbutton)

            let songdetails = document.createElement("div")
                songdetails.className = "songdetails"

                let songicon = document.createElement("img")
                    songicon.src = `img/icons/${serieses[i]}.png`
                let songtitle = document.createElement("p")
                    songtitle.innerText = songname

                songdetails.append(songicon,songtitle)
            
            songentry.append(playcontainer, songdetails)
        SONG_LIST.append(songentry)
   
        i++
        if(i != songnames.length) {
            let separator = document.createElement("div")
                separator.className = "separator"
            SONG_LIST.append(separator)
        }
    }
}
populatesonglist()

var songidx = 0
function play(idx, forced=false) {
    let songentry = document.getElementById(idx.toString())
    let playbutton = songentry.getElementsByTagName("img")[0]

    if(!forced && playbutton != curplaybutton && curplaybutton) {
        playing = false
        curplaybutton.src = "img/play.png"
    }
    curplaybutton = playbutton
    
    songidx = idx

    audio.src = canplay[songidx]

    songname.style.color = "white"
    songname.innerHTML = `<i>"${songnames[songidx]}"</i>`

    if(forced) {
        playing = false
    }
    toggleplay()
}
function toggleplay(forced=false) {
    playing = !playing

    if(playing) {
        piano.src = "img/piano.gif"
        curplaybutton.src = "img/pause.png"

        audio.play()
    } else {
        piano.src = "img/piano.png"
        curplaybutton.src = "img/play.png"

        audio.pause()
        audio.currentTime = 0

        songname.style.color = "black"
    }
}

audio.addEventListener('ended', function() {
    if(!PIANO_DATA.autoplay && !PIANO_DATA.looponce) {
        console.log("condition 1")
        toggleplay(true)
    } else if(PIANO_DATA.autoplay) {
        console.log("condition 2")

        let newidx
        if(!PIANO_DATA.shuffle) {
            console.log("condition 2.1")

            newidx = songidx+1
            if(newidx > canplay.length-1) {
                console.log("condition 2.1.1")

                if(!PIANO_DATA.loop) {
                    console.log("condition 2.1.1.1")

                    toggleplay(true)
                    return
                } else {
                    console.log("condition 2.1.1.2")

                    newidx = 0
                }
            }
        } else {
            console.log("condition 2.2")

            newidx = Math.floor(Math.random() * canplay.length)
        }
        play(newidx)
    } else if(PIANO_DATA.looponce) {
        console.log("condition 3")
        play(songidx, true)
    }
})

// datastuff
function save() {
    window.localStorage.setItem(PIANO_DATA_KEY, JSON.stringify(PIANO_DATA))
}
function toggle(what) {
    PIANO_DATA[what] = !PIANO_DATA[what]
    save()
}

// populate
let autoplaycheck = document.getElementById("autoplay")
let looponcecheck = document.getElementById("looponce")
let shufflecheck  = document.getElementById("shuffle")
let loopcheck     = document.getElementById("loop")

autoplaycheck.checked = PIANO_DATA.autoplay
looponcecheck.checked = PIANO_DATA.looponce
shufflecheck.checked  = PIANO_DATA.shuffle
loopcheck.checked     = PIANO_DATA.loop

// set up toggling
autoplaycheck.addEventListener("click", () => {
    toggle("autoplay")
})
looponcecheck.addEventListener("click", () => {
    toggle("looponce")
})
shufflecheck.addEventListener("click", () => {
    toggle("shuffle")
})
loopcheck.addEventListener("click", () => {
    toggle("loop")
})