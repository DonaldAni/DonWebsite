const canpick = [
    "sound/allstar.mp3",
    "sound/inferno.mp3"
]

let audio = new Audio()
audio.src = canpick[Math.floor(Math.random() * canpick.length)]

audio.loop = true
audio.play()