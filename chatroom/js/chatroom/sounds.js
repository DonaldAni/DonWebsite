export const SEND_SOUND = document.createElement("audio")
    SEND_SOUND.src = "sound/send.mp3"
export const RECIEVE_SOUND = document.createElement("audio")
    RECIEVE_SOUND.src = "sound/recieve.mp3"
export const SYSTEM_RECIEVE_SOUND = document.createElement("audio")
    SYSTEM_RECIEVE_SOUND.src = "sound/topic.mp3"
export const MENTIONED_SOUND = document.createElement("audio")
    MENTIONED_SOUND.volume = 0.25
    MENTIONED_SOUND.src = "sound/mentioned.mp3"

export default {
    SEND_SOUND,
    RECIEVE_SOUND,
    SYSTEM_RECIEVE_SOUND,
    MENTIONED_SOUND
}