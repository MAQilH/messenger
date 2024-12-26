import router from "./router"
import socket from "./socket"
import store from "./store"

function callbackHandler(res, err, callback) {
    if(err) {
        console.warn(err)
        if(err.status === 401) router.redirect('/login')
        return
    }
    callback(res)
}

class SocktBridge {
    searchUsers(searchQuery, callback) {
        store.socket.emit('searchUser', searchQuery, callback)
    }
    connect(callback) {
        console.log(store.socket)
        store.socket.emit('connectUser', {token: store.token}, (res, err) => {
            if(err) {
                console.warn(err)
                if(err.status === 401) router.redirect('/login')
                return
            }
            store.userId = res
            callback()
        })
    }

    getConversationId(userId, contactId, callback) {
        console.log(userId, contactId)
        store.socket.emit('getConversationId', {firstUserId: userId, secUserId: contactId}, (res, err) => {
            if(err) {
                console.warn(err)
                if(err.status === 401) router.redirect('/login')
                return
            }
            store.conversationId = res
            callback(res)
        })
    } 

    loadMessage(conversationId, beginMessageId, numberOfLoadMessage, callback) {
        store.socket.emit('loadMessage', {conversationId, beginMessageId, numberOfLoadMessage}, (res, err) => callbackHandler(res, err, callback))
    }

    getUserWithUserId(userId, callback) {
        store.socket.emit('getUserWithUserId', userId, (res, err) => callbackHandler(res, err, callback))
    }

    sendMessage(data, callback) {
        store.socket.emit('sendMessage', data, (res, err) => callbackHandler(res, err, callback))
    }

    seenConversationMessages(conversationId, callback) {
        store.socket.emit('seenConversationMessages', {conversationId}, (res, err) => callbackHandler(res, err, callback))
    }

    userContacts(callback) {
        store.socket.emit('userContacts', {}, (res, err) => callbackHandler(res, err, callback))
    }

    onTypeing(conversationId, callback) {
        store.socket.emit('onTypeing', {conversationId}, (res, err) => callbackHandler(res, err, callback))
    }

    offTypeing(conversationId, callback) {
        store.socket.emit('offTypeing', {conversationId}, (res, err) => callbackHandler(res, err, callback))
    }
    
    disconnect() {
        store.socket.disconnect()
        console.log('Disconnected from the server');
    }
}

export default SocktBridge