let audio = new Audio()
audio.src = "sound/gameover.ogg"

audio.loop = true
audio.play().catch(() => {
    window.addEventListener("pointerdown", () => {
        audio.play()
    })
})

let toggle = document.getElementById("mute")
toggle.addEventListener("click", () => {
    audio.muted = !audio.muted
})