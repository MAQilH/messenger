import store from "../store"
import MessageView from "../view/messageView"

class MessageController {
    _messageView
    messageId
    init(parent, data, fromMe) {
        this._messageView = new MessageView()
        this._messageView.render(parent, data, fromMe)
        this.messageId = data._id
    }

    rerender(data) {
        this.messageId = data._id
        this._messageView.rerender(data, data.senderId === store.userId)
    }

    close() {
        this._messageView.close()
    }    
}

export default MessageController