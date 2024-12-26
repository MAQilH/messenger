import API from '../api'
import RegisterView from '../view/registerView'
import router from '../router'
import UserCardView from '../view/userCardView'
import app from '../app'
import store from '../store'

class UserCardController {
    _cardView
    _data
    _startConversationHandler

    init(parent, data) {
        this._cardView = new UserCardView()
        this._cardView.render(parent, data)
        this._cardView.addCardClickHandler(this.startConversation.bind(this))
    }

    startConversation() {
        store.startChatEvent.emit(this._cardView.getCardId())
    }

    updateContactStatus(data) {
        console.log(data)
        this._cardView.fillStatus(data)
    }

    increaseUnseenMessageNumber(inc) {
        this._cardView.increaseUnseenMessageNumber(inc)
    }

    updateNewMassage(message) {
        console.log(message)
        const data = {
            lastMessage: message
        }
        this._cardView.updateLastMessage(data)
        this._cardView.moveToBeginOfParent()
    }

    close() {
        this._cardView.close()
    }
}

export default UserCardController