function applycoloring() {
    let coloring = document.createElement("link")
    coloring.href = "/shared/css/coloring.css"
    coloring.rel = "stylesheet"

    document.head.append(coloring)

    let topcolor = document.createElement("div")
        topcolor.className = "topcolor"
        topcolor.ariaHidden = "true"
    let bottomcolor = document.createElement("div")
        bottomcolor.className = "bottomcolor"
        bottomcolor.ariaHidden = "true"

    let bgcolor = window.getComputedStyle(document.body).backgroundColor
        bottomcolor.style.background = bgcolor
    console.log(bgcolor)

    document.body.append(topcolor, bottomcolor)

    document.body.style.backgroundColor = "black" //"#ffae6b"

    console.log("colored!")
}

applycoloring()