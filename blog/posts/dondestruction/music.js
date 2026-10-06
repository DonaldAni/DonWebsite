let audio = new Audio()
audio.src = "sound/bread.mp3"

audio.loop = true
audio.play().catch(() => {
    window.addEventListener("pointerdown", () => {
        audio.play()
    })
})