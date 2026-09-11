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
    "sound/piano14.mp3"
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
    "A WAY OUT"
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
    "awayout"
]

function populatesonglist() {
    const SONG_LIST = document.getElementById("songlist")

    let i = 0
    for(const songname of songnames) {
        console.log(songname)
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
                        console.log(ii)
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

function play(idx) {
    let songentry = document.getElementById(idx.toString())
    let playbutton = songentry.getElementsByTagName("img")[0]

    if(playbutton != curplaybutton && curplaybutton) {
        playing = false
        curplaybutton.src = "img/play.png"
    }
    curplaybutton = playbutton
    
    var songidx = idx

    audio.src = canplay[songidx]

    songname.style.color = "white"
    songname.innerHTML = `<i>"${songnames[songidx]}"</i>`

    toggleplay()
}
function toggleplay() {
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

audio.addEventListener('ended', toggleplay)