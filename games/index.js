const LOADING = document.getElementById("loading")
const GAMESLIST = document.getElementById("gameslist")
GAMESLIST.style.display = "none"

fetch("./exports/meta.json")
    .then(res => res.json())
    .then((data) => {
        console.log(data)

        /*
            <div class="gamecard">
                <img src="thumbnails/runner.png" class="gamethumb">
                <div class="gtcontainer">
                    <h4 class="gametitle">Kayla Takes a Really Really Bad Turn</h1>
                </div>
            </div>
        */

        for(const key of data.order) {
            console.log(key)

            let gamecard = document.createElement("div")
                gamecard.className = "gamecard"

                let gamethumb = document.createElement("img")
                    gamethumb.className = "gamethumb"
                    gamethumb.src = `./thumbnails/${key}.png`

                let gtcontainer = document.createElement("div")
                    gtcontainer.className = "gtcontainer"
                    
                    let gametitle = document.createElement("h4")
                        gametitle.className = "gametitle"
                        gametitle.innerText = data.data[key].title

                    gtcontainer.append(gametitle)

                gamecard.append(gamethumb)
                gamecard.append(gtcontainer)

            let a = document.createElement("a")
                a.href = `./play.html?game=${key}`

            a.append(gamecard)
                
            GAMESLIST.append(a)
        }

        LOADING.style.display = "none"
        GAMESLIST.style.display = "grid"
    })