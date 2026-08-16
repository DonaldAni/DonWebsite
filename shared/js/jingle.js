class PageJingle extends HTMLElement {
    connectedCallback() {
        let src = this.getAttribute("src")
        if(!src) {
            console.warn("page-jingle defined without src!")
        }
        let vol = this.getAttribute("volume")
        if(!vol) {
            vol = 1
        } else {
            vol = parseFloat(vol)
        }

        console.log(src, vol)

        let audio = new Audio(src)
        audio.volume = vol
        audio.play()
            .catch(() => {
                window.addEventListener("pointerdown", () => {
                    audio.play()
                }, { once: true })
            })
    }
}

customElements.define("page-jingle", PageJingle)