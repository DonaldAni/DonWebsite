const CONTAINER = document.getElementById("container")
CONTAINER.style.display = "none"

fetch("./exports/meta.json")
    .then(res => res.json())
    .then((data) => {
        console.log(data)

        let rawparams = window.location.search
        let params = new URLSearchParams(rawparams)

        let game = params.get("game")
        let gamedata = data.data[game]

        const FF_WARNING = document.getElementById("ffwarning")
        if(navigator.userAgent.includes("Firefox") && gamedata.type == "wasm") {
            FF_WARNING.style.display = "flex"
        } else {
            FF_WARNING.style.display = "none"
        }

        const TITLE = document.getElementById("title")
        TITLE.textContent = gamedata.title

        const GAME = document.getElementById("game")

        for(const stylekey of Object.keys(gamedata.style)) {
            GAME.style[stylekey] = gamedata.style[stylekey]
        }
        GAME.src = `./exports/${game}/index.html`

        CONTAINER.style.display = "block"
    })