import { MessageType } from "./messages.js"
import { sendmessage } from "./network.js"

class Command {
    constructor(key, onrun) {
        this.key = key
        this.run = onrun
    }
}

export default [
    new Command('me', (args) => {
        let action = args.join(" ")

        sendmessage(action, MessageType.ACTION)
    })
]