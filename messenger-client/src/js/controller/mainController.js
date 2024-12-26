import api from '../api'
import router from '../router'
import MainView from '../view/mainView'
import ChatController from './chatController'
import ContactController from './contactController'
import SearchController from './searchController'
import app from '../app'
import store from '../store'
import Socket from '../socket'
import EmptyChatController from './emptyChatController'

class MainController {
    _mainView
    _chatController
    _contactController
    _searchController 
    _emptyChatController
    socketComponent

    init() {
        this._mainView = new MainView()
        this._mainView.render(document.body)
        
        this._contactController = new ContactController()
        this._contactController.init(this._mainView.main)
        
        this._contactController._contactView.addSearchClickHandler(this.showSearchView.bind(this))
        
        this._emptyChatController = new EmptyChatController()
        this._emptyChatController.init(this._mainView.main)
        
        this.socketComponent = new Socket()
        this.socketComponent.init(function(){
            app.bridge.userContacts(function(data){
                console.log(data)
                this._contactController.showUserContacts(data)
            }.bind(this))
        }.bind(this))

        store.socket = this.socketComponent.socket
        store.startChatEvent.addSubscriber(this.startConversation.bind(this))
        store.messageEvent.addSubscriber(this.onMessage.bind(this))
        store.seenEvent.addSubscriber(this.onSeen.bind(this))
        store.isTypeingEvent.addSubscriber(this.onIsTypeing.bind(this))
        store.onlineStatusEvent.addSubscriber(this.onOnlineStatus.bind(this))
        store.insertNewConversationEvent.addSubscriber(this.onInsertNewConversation.bind(this))
    }

    onInsertNewConversation(data) {
        console.log(`new conversation want to insert with this data: ${data}`)
        this._contactController.insertContact(data)
    }

    onOnlineStatus(data) {
        this._contactController.updateContactStatus(data)
        if(this._chatController && data.conversationId === store.conversationId) {
            this._chatController.updateContactStatus(data)
        }
    }

    onIsTypeing(data) {
        this._contactController.updateConversationStatus(data)
        if(store.currentConversationId === data.conversationId) {
            this._chatController.updateContactStatus(data)
        }
    }

    onSeen(data) {
        const {seenedMessageIds, conversationId} = data
        if(this._chatController && store.currentConversationId === conversationId) {
            this._chatController.onSeen(seenedMessageIds)
        }
    }

    dispalyNewChatView(chatInfo) {
        if(this._emptyChatController) {
           this._emptyChatController.close()
           this._emptyChatController = null 
        }
        if(this._chatController) {
            this._chatController.close()
        }
        store.currentConversationId = chatInfo.conversationId
        this._chatController = new ChatController()
        this._chatController.init(this._mainView.main, chatInfo)
        this._chatController.addOnSeenHandler(this.onMySeen.bind(this))
        this._chatController.addBackHandler(this.backFromChatView.bind(this))
    }

    onMySeen(seenNumber) {
        this._contactController.increaseUnseenMessageNumber(store.currentConversationId, -seenNumber)
    }

    showSearchView() {
        this._contactController.hide()
        this._createNewSearchController()
    }
    
    _createNewSearchController() {
        this._searchController = new SearchController()
        this._searchController.init(this._mainView.main)
        this._searchController._searchView.addCloseHandler(this.closeSearchView.bind(this))
    }

    startConversation(cardInfo) {
        if(cardInfo.conversationId) {
            this.dispalyNewChatView(cardInfo)
            this.changeActiveViewState(true)
        } else {
            app.bridge.getConversationId(store.userId, cardInfo.userId, (conversationId) => {
                cardInfo.conversationId = conversationId
                this.dispalyNewChatView(cardInfo)
                this.changeActiveViewState(true)
            })
        }
    }

    changeActiveViewState(isChat) {
        if(this._contactController) this._contactController.updateViewActiveState(!isChat)
        if(this._searchController) this._searchController.updateViewActiveState(!isChat)
        if(this._emptyChatController) this._emptyChatController.updateViewActiveState(isChat)
        if(this._chatController) this._chatController.updateViewActiveState(isChat)
    }

    backFromChatView() {
        this.changeActiveViewState(false)
    }

    closeSearchView() {
        this._searchController.close()
        this._contactController.show()
    }
    
    onMessage(data) {
        console.log(data)
        this.showMessageInChatView(data)
        this._contactController.newMessageAdded(data)
    }

    showMessageInChatView(data) {
        if(store.currentConversationId !== data.conversationId) return 
        this._chatController.insertNewMessage(data)
        app.bridge.seenConversationMessages(store.currentConversationId, this.onMySeen.bind(this))
    }

    close() {
        app.bridge.disconnect()
        this._mainView.close()
        store.startChatEvent.removeSubscriber(this.startConversation.bind(this))
        store.messageEvent.removeSubscriber(this.onMessage.bind(this))
        store.seenEvent.removeSubscriber(this.onSeen.bind(this))
        store.isTypeingEvent.removeSubscriber(this.onIsTypeing(this))
        store.onlineStatusEvent.removeSubscriber(this.onOnlineStatus.bind(this))
        store.insertNewConversationEvent.removeSubscriber(this.onInsertNewConversation.bind(this))
    }
}

export default MainController