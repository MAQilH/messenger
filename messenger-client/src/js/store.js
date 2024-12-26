import { version } from "process"
import Event from "./event"

class Store {
    socket
    userId
    currentConversationId
    startChatEvent = new Event()
    messageEvent = new Event()
    seenEvent = new Event()
    isTypeingEvent = new Event()
    onlineStatusEvent = new Event()
    insertNewConversationEvent = new Event()

    get token() {
        return localStorage.getItem('token')
    }

    set token(newToken) {
        localStorage.setItem('token', newToken)
    }
}

const store = new Store()
export default store