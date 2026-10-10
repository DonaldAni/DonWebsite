let audio = new Audio()
audio.src = "sound/music.mp3"

audio.loop = true
audio.volume = .2
audio.play().catch(() => {
    window.addEventListener("pointerdown", () => {
        audio.play()
    })
})