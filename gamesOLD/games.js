class GameTile extends HTMLElement {
    connectedCallback() {
        const thumbnail = this.getAttribute("thumbnail")
        const name = this.getAttribute("name")
        const linkto = this.getAttribute("linkto")

        this.outerHTML = `
            <div class="gametile">
                <a href="${linkto}">
                    <div>
                        <img src="thumbnails/${thumbnail}.png" class="gamethumb">
                        <p>${name}</p>
                    </div>
                </a>
            </div>
        `
    }
}

customElements.define("game-tile", GameTile)