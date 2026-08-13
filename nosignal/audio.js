const bgMusic = new Audio('nosignal.mp3');

bgMusic.loop = true;

window.addEventListener('click', () => {
    bgMusic.play()
        .then(() => console.log("booyah."))
        .catch(error => console.error("fuck:", error));
}, { once: true }); 
