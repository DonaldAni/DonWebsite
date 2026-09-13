let audio = new Audio()
audio.src = "sound/Blog post 1 music.mp3"

audio.loop = true
audio.play().catch(() => {
    window.addEventListener("pointerdown", () => {
        audio.play()
    })
})