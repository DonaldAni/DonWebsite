const audio = document.createElement("audio")
audio.src = "sound/game-jingle.mp3"

audio.volume = 0.3; // uhhh 1 is max and then its like decimals that go by 10's and 100's places
audio.play().catch(() => {
    console.log("cant autoplay dumbfuck");
});