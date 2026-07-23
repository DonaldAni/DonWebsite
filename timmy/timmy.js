const mobilewarning = document.getElementById("mobilewarning")
if(window.innerWidth < 600) {
    mobilewarning.style.display = "block"
} else {
    mobilewarning.style.display = "none"
}

const timmy = document.getElementById("timmy")
const timmytalk = document.getElementById("timmytx")
const breath = new Audio("sound/timmy breath.wav")
console.log(timmy)

timmy.onclick = function() {
    timmytalk.remove()

    // mark the audio to play on the home menu
    localStorage.setItem('playjingle', 'true')

    timmy.src = "img/timmybreath.png"
    breath.play()

    setTimeout(function() {
       window.location.href = "/home"; 
    }, breath.duration*1000)
}