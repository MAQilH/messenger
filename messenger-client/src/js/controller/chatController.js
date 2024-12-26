import app from "../app"
import store from "../store"
import ChatView from "../view/chatView"
import MessageController from "./messageController"

class ChatController {
    _chatView
    _conversationId
    _onSeenHandler
    messageControllerStore = {}

    init(parent, chatInfo) {
        console.log(chatInfo)
        this._chatView = new ChatView()
        this._chatView.render(parent)
        app.bridge.getUserWithUserId(chatInfo.userId, function(data) {
            this._chatView.updateContactData(data)            
            this._conversationId = chatInfo.conversationId
    
            this._chatView.addSendHandler(this.sendMessage.bind(this))
            this._chatView.addInputChangeHandler(this.changeMessageInput.bind(this))
            if(this._conversationId) this.loadInConversationMode()
        }.bind(this))
    }

    currentTypeing = false
    changeTypeingStatusTimer = null
    changeMessageInput() {
        console.log('changing')
        if(this.changeTypeingStatusTimer) {
            clearTimeout(this.changeTypeingStatusTimer)
            this.changeTypeingStatusTimer = null
        }
        if(!this.currentTypeing) {
            app.bridge.onTypeing(this._conversationId, () => {
                console.log('user on typeing status send successfully')
            })
            this.currentTypeing = true
        }
        this.changeTypeingStatusTimer = setTimeout(function(){
            this.currentTypeing = false
            app.bridge.offTypeing(this._conversationId, () => {
                console.log('user off typeing status send successfully')
            })
        }.bind(this), 2000)
    }

    updateContactStatus(data) {
        this._chatView.fillContactStatus(data)
    }

    async loadInConversationMode() {
        this.loadMessage()
        app.bridge.seenConversationMessages(this._conversationId, (numberOfSeenedMessage) => {
            console.log(numberOfSeenedMessage, 'this number')
            this._onSeenHandler(numberOfSeenedMessage)
        })
    }

    addOnSeenHandler(handler) {
        this._onSeenHandler = handler
    }

    async loadMessage() {
        const data = {
            conversationId: this._conversationId,
            numberOfLoadMessage: 100,
            beginMessageId: undefined
        }
        app.bridge.loadMessage(this._conversationId, undefined, 100, this.onLoad.bind(this))
    }

    onLoad(messages) {
        console.log(messages)
        if(!messages) return
        console.log('resume')
        messages.forEach(function(message) {
            this.insertNewMessage(message)
        }.bind(this));
    }

    onSeen(messages) {
        console.log(messages)
        messages.forEach(message => {
            const controller = this.messageControllerStore[message._id]
            console.log(this.messageControllerStore, message._id)
            controller.rerender(message)
        })
    }

    sendMessage(data) {
        data.senderId = store.userId
        data.conversationId = this._conversationId
        data.createdAt = new Date()
        const controller = this.insertNewMessage(data)
        app.bridge.sendMessage(data, function(message) {
            controller.rerender(message)
            this.messageControllerStore[message._id] = controller            
        }.bind(this))        
    }

    insertNewMessage(data) {
        console.log(data)
        const messageController = new MessageController()
        messageController.init(this._chatView._chatBody, data, data.senderId === store.userId)
        this._chatView._chatBody.scrollTop = this._chatView._chatBody.scrollHeight
        if(data._id) this.messageControllerStore[data._id] = messageController
        return messageController
    }

    updateViewActiveState(active) {
        console.log(this._chatView)
        if(active) this._chatView.active()
        else this._chatView.deactive()
    }

    addBackHandler(handler) {
        this._chatView.addBackHandler(handler)
    }

    close() {
        this._chatView.close()
    }
}

export default ChatController