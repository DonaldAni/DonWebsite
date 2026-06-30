const SAVE_KEY = "musicplayeridx"

// player vars
let playing = false
let thinking = true

// name: audio path
// this wont get shuffled or anything but it WILL remember which song was last playing
let playingidx = 0
let queue = {
    "ill be missing u": "ill be missing you.ogg",
    "virtual insanity": "virtual insanity.ogg",
    "sans.": "sans. (dark world).ogg",
    "future diary": "Kuusou Mesorogiwi.ogg",
    "dont.come.back": "dont come back.ogg"
}

let audiolength = NaN
let durationstringified = ""
let audio = new Audio()
audio.addEventListener('ended', function() {
    stopaudio()
    setsong((playingidx + 1) % Object.keys(queue).length)
})
audio.addEventListener('loadedmetadata', function() {
    audiolength = audio.duration
    console.log(audiolength)
})

let failaudio = new Audio(getaudiosource("sfx/snd_failure2.mp3"))

// utils
function idxtosongkey(idx) {
    return Object.keys(queue)[playingidx]
}
function getaudiosource(filename) {
    return `/shared/sound/musicplayer/${filename}`
}
function formattime(seconds) {
    let mins = Math.floor(seconds / 60).toString()
    let secs = Math.floor(seconds % 60).toString() // ha ha sex

    while(secs.length < 2) {
        secs = "0" + secs
    }

    return `${mins}:${secs}`
}

// import css
let css = document.createElement('link')
    css.rel = "stylesheet"
    css.href = "/shared/css/musicplayer.css"
document.head.append(css)

// construct music player
let musicplayerroot = document.createElement("div")
    musicplayerroot.id = "musicplayerroot"

    let tabber = document.createElement("div")
        tabber.id = "mptabber"

        let nowplaying = document.createElement("p")
            nowplaying.textContent = "now playing: penis music"
            nowplaying.id = "mpnowplaying"

        tabber.append(nowplaying)    
    musicplayerroot.append(tabber)

    let songlistroot = document.createElement("div")
        songlistroot.id = "mpsonglist"

        let songlist = document.createElement("ol")
            songlist.id = "mpol"

        songlistroot.append(songlist)
    
    musicplayerroot.append(songlistroot)

    let timeroot = document.createElement("div")
        timeroot.id = "mptimecontainer"

        let timer = document.createElement("p")
            timer.id = "mptimer"

            timer.innerText = "0:00 / 0:00"
        
        timeroot.append(timer)
    
    musicplayerroot.append(timeroot)

    let playheadback = document.createElement("div")
        playheadback.id = "mpplayheadback"

        let playbar = document.createElement("div")
            playbar.id = "mpplaybar"

            let playhead = document.createElement("div")
                playhead.id = "mpplayhead"

            playbar.append(playhead)

        playheadback.append(playbar)

    musicplayerroot.append(playheadback)

    let controls = document.createElement("div")
        controls.id = "mpcontrols"
    
        let playbutton = document.createElement("img")
            playbutton.src = "/shared/img/musicplayer/play.gif"
            playbutton.id = "mptoggle"
            playbutton.className = "mpcontrol"

        let skipback = document.createElement("img")
            skipback.src = "/shared/img/musicplayer/skipback.gif"
            skipback.id = "mpskipback"
            skipback.className = "mpcontrol"

        let skip = document.createElement("img")
            skip.src = "/shared/img/musicplayer/skip.gif"
            skip.id = "mpskip"
            skip.className = "mpcontrol"

        controls.append(skipback)
            controls.append(document.createElement("hr"))
        controls.append(playbutton)
            controls.append(document.createElement("hr"))
        controls.append(skip)

    musicplayerroot.append(controls)

        
document.body.append(musicplayerroot)

// funcs
function regensonglist() {
    let songnames = Object.keys(queue)

    nowplaying.textContent = `now playing: ${songnames[playingidx]}`

    let i = 0
    songlist.replaceChildren()
    for(const songname of songnames) {
        let li = document.createElement("li")
            li.innerText = songname
            li.className = i === playingidx ? "mpcurrentlyplaying" : "mpnotplaying"

        songlist.append(li)
        i++
    }
}
regensonglist()

function updateplayheadpos(percent) {
    playbar.style.width = `${Math.floor(percent*100)}%`
}
updateplayheadpos(0)

function updateplaybutton() {
    playbutton.src = `/shared/img/musicplayer/${!playing ? "play" : "pause"}.gif`
}
updateplaybutton()

function playaudio() {
    audio.play()
    playing = true
    updateplaybutton()
}
function pauseaudio() {
    audio.pause()
    playing = false
    updateplaybutton()
}
function stopaudio() {
    pauseaudio()
    audio.currentTime = 0
}
function setsong(idx, autoplay=true) {
    thinking = true
    audiolength = NaN
    durationstringified = ""

    playingidx = idx
    localStorage.setItem(SAVE_KEY, playingidx.toString())
    regensonglist()

    audio.src = getaudiosource(queue[idxtosongkey(idx)])
    audio.addEventListener('canplaythrough', function() {
        thinking = false
        if(autoplay) {
            playaudio()
        }
    }, {once: true})
}
let toset = 0
let loaded = localStorage.getItem(SAVE_KEY)
console.log(loaded)
if(loaded !== null) {
    toset = parseInt(loaded)
    if(isNaN(toset)) {
        toset = 0
    }
}
setsong(toset, false)

// hooks
skipback.addEventListener('click', function() {
    let skippingto = playingidx - 1
    if(skippingto < 0) {
        skippingto = Object.keys(queue).length - 1
    }

    setsong(skippingto)
})
playbutton.addEventListener('click', function() {
    if(thinking) {
        failaudio.play()
        return
    }
    if(playing) {
        pauseaudio()
    } else {
        playaudio()
    }
})
skip.addEventListener('click', function() {
    let skippingto = (playingidx + 1) % Object.keys(queue).length
    setsong(skippingto)
})

// loop
function loop(dt) {
    if(!isNaN(audiolength)) {
        if(durationstringified.length === 0) {
            durationstringified = formattime(audiolength)
        }
        timer.innerText = `${formattime(audio.currentTime)} / ${durationstringified}`

        let percent = audio.currentTime / audiolength
        updateplayheadpos(percent)
    }

    requestAnimationFrame(loop)
}
requestAnimationFrame(loop)