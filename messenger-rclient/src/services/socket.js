import config from "../config"
import { getAuthToken } from "../utils/authToken"
import { redirect } from "../utils/router"
import { io } from 'socket.io-client'
import store from "../store"
import { chatActions } from "../store/chat/chat-slice"
import { createNewError } from "../store/error/error-action"
import { errorActions } from "../store/error/error-slice"


function callbackHandler(res, err, callback) {
    if(err && err.status !== 200) {
        store.dispatch(createNewError(err.message))
        return
    }
    callback(res)
}

class Socket {
    #socket

    constructor() {
        this.#socket = io(`${config.BASE_URL}`)
        this.initSocketListeners()
    }
    
    initSocketListeners() {
        this.#socket.on('reciveMessage', (message) => {
            store.dispatch(chatActions.reciveNewMessage(message))
        })
    
        this.#socket.on('seenMessages', (data) => {
            store.dispatch(chatActions.seenMessages(data.seenedMessageIds))
        })
    
        this.#socket.on('isTyping', (data) => {
            store.dispatch(chatActions.setConversationTypingStatus(data))
        })
    
        this.#socket.on('online', (data) => {
            store.dispatch(chatActions.setConversationOnlineStatus(data))
        })
    
        this.#socket.on('insertNewConversation', (data) => {
            store.dispatch(chatActions.insertNewConversation(data))
        })
    
        this.#socket.on('disconnect', () => {
            store.dispatch(createNewError('You are disconnected from server!'))
        })
    }

    searchUsers(searchQuery, callback) {
        this.#socket.emit('searchUser', searchQuery, callback)
    }

    connect(callback) {
        this.#socket.emit('connectUser', {token: getAuthToken()}, (res, err) => {
            if(err && err.status !== 200) {
                console.warn(err)
                if(err.status === 401) redirect('/auth/login')
                return
            }
            callback(res)
        })
    }

    getConversationId(userId, contactId, callback) {
        this.#socket.emit('getConversationId', {firstUserId: userId, secUserId: contactId}, (res, err) => {
            if(err && err.status !== 200) {
                console.warn(err)
                if(err.status === 401) redirect('/auth/login')
                return
            }
            callback(res)
        })
    } 

    getContactIdInConversation(conversationId, callback) {
        this.#socket.emit('getContactIdInConversation', {conversationId}, (res, err) => callbackHandler(res, err, callback))
    }

    loadUpMessage(conversationId, beginMessageId, numberOfLoadMessage, callback) {
        this.#socket.emit('loadUpMessage', {conversationId, beginMessageId, numberOfLoadMessage}, (res, err) => callbackHandler(res, err, callback))
    }

    loadDownMessage(conversationId, beginMessageId, numberOfLoadMessage, callback) {
        this.#socket.emit('loadDownMessage', {conversationId, beginMessageId, numberOfLoadMessage}, (res, err) => callbackHandler(res, err, callback))
    }

    getUserWithUserId(userId, callback) {
        this.#socket.emit('getUserWithUserId', userId, (res, err) => callbackHandler(res, err, callback))
    }

    sendMessage(data, callback) {
        this.#socket.emit('sendMessage', data, (res, err) => callbackHandler(res, err, callback))
    }

    seenConversationMessages(conversationId, callback) {
        this.#socket.emit('seenConversationMessages', {conversationId}, (res, err) => callbackHandler(res, err, callback))
    }

    userContacts(callback) {
        this.#socket.emit('userContacts', {}, (res, err) => callbackHandler(res, err, callback))
    }
    
    onTyping(conversationId, callback) {
        this.#socket.emit('onTyping', {conversationId}, (res, err) => callbackHandler(res, err, callback))
    }

    offTyping(conversationId, callback) {
        this.#socket.emit('offTyping', {conversationId}, (res, err) => callbackHandler(res, err, callback))
    }

    conversationVerify(conversationId, userId, callback) {
        this.#socket.emit('conversationVerify', {conversationId, userId}, (res, err) => callbackHandler(res, err, callback))
    }
    
    disconnect() {
        this.#socket.disconnect()
        console.log('Disconnected from the server');
    }
}

export default new Socket()