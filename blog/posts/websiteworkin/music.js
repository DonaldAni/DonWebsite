let audio = new Audio()
audio.src = "sound/post2music.mp3"

audio.loop = true
audio.play().catch(() => {
    window.addEventListener("pointerdown", () => {
        audio.play()
    })
})