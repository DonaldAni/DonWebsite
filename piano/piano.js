var piano = document.getElementById("piano")
var songname = document.getElementById("songname")

var playing = false
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
    "sound/piano10.mp3"
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
    "Beebo's Theme"
]

function toggleplay() {
    playing = !playing

    if(playing) {
        piano.src = "img/piano.gif"
        
        var songidx = Math.floor(Math.random() * canplay.length)

        audio.src = canplay[songidx]
        audio.play()

        songname.style.color = "white"
        songname.innerHTML = `<i>"${songnames[songidx]}"</i>`
    } else {
        piano.src = "img/piano.png"

        audio.pause()
        audio.currentTime = 0

        songname.style.color = "black"
    }
}



piano.addEventListener('click', toggleplay) 
audio.addEventListener('ended', toggleplay)