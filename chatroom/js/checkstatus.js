// get the status of the chatroom
let ENDPOINT = "https://donaldapi.kayladotcom.org/chatroom"
let chatroomroot = document.getElementById("chatroomroot")

function checkstatus() {
    fetch(`${ENDPOINT}/status`).then(res => res.json()).then(data => {
        let active = data.active

        if(!active) {
            chatroomroot.innerHTML = `
                <p id="downnotice">
                    the chat room is currently not active. sorry!
                </p>
            `
        } else {
            chatroomroot.innerHTML = `
                <div id="philbanner">
                    <img src="img/icons/iconphil.png">
                    <div id="philcontainer">
                        <p id="philtopic">
                            CHAT TOPIC: loading...
                        </p>
                        <p id="philfooter">
                            chat topics are just suggestions! talk about whatever you want!
                        </p>
                    </div>
                </div>

                <div id="chatroomhistory">
                    
                </div>
                <div id="chatroombottom">
                    <div id="chatroompersonalizeroot">
                        <div id="iconselect">
                            <img id="selicon" src="img/icons/icon0.png">
                        </div>
                        <input type="text" id="chatroomnameinput" placeholder="NAME HERE">
                    </div>
                    <div id="chatroominputroot">
                        <textarea id="chatroominput"></textarea>
                    </div>
                </div>
            `

            let script = document.createElement("script")
            script.src = "js/chatroom/chatroom.js?v=6"
            script.type = "module"
            document.body.appendChild(script)
        }
    })
}
checkstatus()