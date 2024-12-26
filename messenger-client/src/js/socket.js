import { io } from "socket.io-client"
import config from "./config"
import store from "./store"
import app from "./app"

class Socket {
    socket
    init(callback) {
        this.socket = io(config.BASE_URL)
        
        this.socket.on('connect', () => {
            app.bridge.connect(callback)
            console.log('its connected!')
        })
        
        this.socket.on('reciveMessage', (data) => store.messageEvent.emit(data))
        this.socket.on('seenMessages', (data) => store.seenEvent.emit(data))
        this.socket.on('isTypeing', (data) => store.isTypeingEvent.emit(data))
        this.socket.on('online', (data) => store.onlineStatusEvent.emit(data))
        this.socket.on('insertNewConversation', (data) => store.insertNewConversationEvent.emit(data))

        this.socket.on('disconnect', () => {
            console.log("user disconnected form socket!!")
        })
    }
}

export default Socket