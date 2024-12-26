const socketIo = require('socket.io');
const database = require('./database');
const auth = require('./auth');
const fs = require('fs');
const { callbackify } = require('util');

function verifySocketToken(token, callback) {
    const userId = auth.getUserIdFromToken(token)
    if(!userId) {
        callback(null, {
            status: 401,
            message: 'Token is invalid'
        })
        return null
    }
    return userId
}

class Socket {
    init(server) {  
        const socketIdStore = {}
        const userIdStore = {}

        const io = socketIo(server, {
            cors: {
                    origin: "*",
                    methods: ["GET", "POST"]
                }
            }
        )

        console.log('Socket was connected')

        io.on('connection', (socket) => {
            console.log('A user connected:', socket.id);
            socket.on('connectUser', async(data, callback) => {
                const userId = verifySocketToken(data.token, callback)
                if(!userId) return
                try {
                    socketIdStore[userId] = socket.id
                    userIdStore[socket.id] = userId
                    const contacts = await database.getUserContacts(userId)
                    sendOnlieStatusToContact(userId, contacts)
                    callback(userId, null)
                } catch (err) {
                    callback(null, {
                        status: 400,
                        message: 'Something Wrong in the Server-Side'
                    })
                    console.log(err)
                }
            })

            async function normUsers(users) {
                if(!users) return
                users.forEach(normUser)
            }

            async function normUser(user) {
                user.online = isOnlie(user._id)
            }

            async function sendOnlieStatusToContact(userId, contacts) {
                if(!contacts) return
                contacts.forEach(async contact => {
                    if(isOnlie(contact._id)) {
                        io.to(socketIdStore[contact._id.toString()]).emit('online', {
                            contactId: userId,
                            online: true
                        })
                    }
                })
            }

            socket.on('userContacts', async(data, callback) => {
                const userId = userIdStore[socket.id]
                const contacts = await database.getUserContacts(userId)
                normUsers(contacts)
                callback(contacts)
            })

            function isOnlie(userId) {
                return socketIdStore[userId.toString()]? true: false
            }

            async function getContactId(conversationId) {
                const userId = userIdStore[socket.id]
                return await database.getContactIdInConversation(conversationId, userId)
            }

            socket.on('getContactIdInConversation', async(data, callback) => {
                const {conversationId} = data
                if(!conversationId) {
                    callback(null, {
                        status: 400,
                        message: "Some Thing Was Wrong! Please refresh your page."  
                    })
                    return 
                }
                callback(await getContactId(conversationId))
            })

            async function isTypingHandler(typingStatus, data, callback) {
                const {conversationId} = data
                if(!conversationId) {
                    callback(null, {
                        status: 400,
                        message: "Some Thing Was Wrong! Please refresh your page."
                    })
                    return 
                }
                const contactId = await getContactId(conversationId)
                if(isOnlie(contactId)) {
                    const socketId = socketIdStore[contactId]
                    console.log('send is typing status to contact')
                    io.to(socketId).emit('isTyping', {
                        conversationId,
                        typingStatus,
                        lastSeen: new Date(),
                        online: true
                    })
                }
                callback()
            }

            socket.on('onTyping', async(data, callback) => isTypingHandler(true, data, callback))
            socket.on('offTyping', async(data, callback) => isTypingHandler(false, data, callback))
            
            async function createConversation(firstUserId, secUserId) {
                if(firstUserId === secUserId) return null
                const conversation = await database.createNewConversation(firstUserId, secUserId)
                const conversationId = conversation._id
                await database.addConversationToUser(conversationId, firstUserId)
                await database.addConversationToUser(conversationId, secUserId)
                return conversationId
            }

            socket.on('getConversationId', async({firstUserId, secUserId}, callback) => {
                if(!firstUserId || !secUserId) {
                    callback(null, {
                        status: 400,
                        message: "Some Thing Was Wrong! Please refresh your page."
                    })
                    return
                }
                if(firstUserId < secUserId) {
                    const tmp = firstUserId
                    firstUserId = secUserId
                    secUserId = tmp
                }
                
                let conversationId = await database.getConverstionIdWithUsers(firstUserId, secUserId)
                if(!conversationId) {
                    conversationId = await createConversation(firstUserId, secUserId)
                    if(!conversationId) {
                        callback(null, {
                            status: 400,
                            message: 'You can send message to your self!' 
                        })
                        return
                    }
                    sendNewConversation(firstUserId, secUserId, conversationId)
                    sendNewConversation(secUserId, firstUserId, conversationId)
                }
                callback(conversationId, {status: 200})
            })

            async function sendNewConversation(creatorId, recievrId, conversationId) {
                if(isOnlie(recievrId)) {
                    const sender = await database.findUserById(creatorId)
                    io.to(socketIdStore[recievrId]).emit('insertNewConversation', {
                        _id: sender._id,
                        username: sender.username,
                        lastSeen: sender.lastSeen,
                        conversationId,
                        online: isOnlie(sender._id),
                        unseen: 0
                    })
                }
            }

            socket.on('getUserWithUserId', async(userId, callback) => {
                if(!userId) {
                    callback(null, {
                        status: 400,
                        message: 'You can send message to your self!' 
                    })
                    return 
                }
                const user = await database.findUserById(userId, 'username lastSeen online imgUrl')
                normUser(user)
                callback(user)                
            })

            socket.on('searchUser', async (searchInput, callback) => {
                if(!searchInput) {
                    callback(null, {
                        status: 400,
                        message: 'You can send message to your self!' 
                    })
                    return
                }
                const users = await database.searchUsersByUsername(searchInput)
                normUsers(users)
                callback(users)
            })

            socket.on('sendMessage', async (data, callback) => {
                const {conversationId, senderId, text, files} = data
                if(!conversationId || !senderId) {
                    callback(null, {
                        status: 400,
                        message: 'You can send message to your self!' 
                    })
                    return
                }
                console.log('this is my files: ', files)
                const urls = []
                const promises = []
                files.forEach((file, index) => {
                    console.log(file, index)
                    promises.push(new Promise((res, rej) => {
                        const fileName = `file-${index}-${new Date()}.png`
                        fs.writeFile(`public/media/${fileName}`, file, (err) => {
                            if (err) {
                                console.log('Error writing file:', err);
                                rej(err)
                            } 
                            else {
                                urls.push(`http://localhost:3000/media/${fileName}`)
                                res()
                                console.log('saved!')
                            }
                        });
                    }))
                })
                await Promise.all(promises)
                
                const message = await database.createNewMessage(senderId, conversationId, text, urls)
                if(!message) {
                    callback(null, {
                        status: 400,
                        message: 'Something was wrong in server-side'
                    })
                    return
                }
                const contactId = await database.getContactIdInConversation(conversationId, senderId)
                if(!contactId) {
                    callback(null, {
                        status: 400,
                        message: 'Something was wrong in server-side'
                    })
                    return
                }
                await database.addMessageToConversation(conversationId, message)
                if(isOnlie(contactId)) {
                    const contactSocketId = socketIdStore[contactId]
                    io.to(contactSocketId).emit('reciveMessage', message)
                }
                callback(message)                
            })

            socket.on('loadUpMessage', async (data, callback) => {
                const {conversationId, beginMessageId, numberOfLoadMessage} = data
                if(!conversationId) {
                    callback(null, {
                        status: 400,
                        message: "Some Thing Was Wrong! Please refresh your page."
                    })
                    return
                }
                const res = await database.loadUpMessage(conversationId, beginMessageId, numberOfLoadMessage)
                callback(res)
            })

            socket.on('loadDownMessage', async(data, callback) => {
                const {conversationId, beginMessageId, numberOfLoadMessage} = data
                if(!conversationId) {
                    callback(null, {
                        status: 400,
                        message: "Some Thing Was Wrong! Please refresh your page."
                    })
                    return
                } 
                const res = await database.loadDownMessage(conversationId, beginMessageId, numberOfLoadMessage)
                callback(res)
            })

            socket.on('seenConversationMessages', async(data, callback) => {
                const {conversationId} = data
                if(!conversationId) {
                    callback(null, {
                        status: 400,
                        message: "Some Thing Was Wrong! Please refresh your page."
                    })
                }
                const userId = userIdStore[socket.id]
                const messages = await database.loadUnseenMessages(conversationId)
                const contactId = await database.getContactIdInConversation(conversationId, userId)
                let numberOfSeenedMessage = 0
                if(!messages) {
                    callback(numberOfSeenedMessage)
                    return
                }
                messages.forEach(message => {
                    if(message.senderId.toString() !== userId.toString()) {
                        numberOfSeenedMessage++
                        const updateAndNotufy = async () => {
                            const updatedMessage = await database.updateSeenMessage(message._id, true, userId)
                            if(isOnlie(contactId)) {
                                socket.to(socketIdStore[contactId]).emit('seenMessages', {
                                    seenedMessageIds: [updatedMessage],
                                    conversationId
                                })
                            }
                        }
                        updateAndNotufy()
                    } 
                });
                // const contactId = await database.getContactIdInConversation(conversationId, userId)
                // if(seenedMessageIds.length > 0 && socketIdStore[contactId]) {
                //     socket.to(socketIdStore[contactId]).emit('seenMessages', {
                //         seenedMessageIds,
                //         conversationId
                //     })
                // }
                console.log('number of seened message', numberOfSeenedMessage)
                callback(numberOfSeenedMessage)
            })

            socket.on('conversationVerify', async(data, callback) => {
                const {conversationId} = data
                if(!conversationId) {
                    callback(null, {
                        status: 400,
                        message: "Some Thing Was Wrong! Please refresh your page."
                    })
                }
                const conversation = await database.findConversationById(conversationId)
                callback({verify: !!conversation})
                return
            })

            // socket.on('searchMessage', async(data, callback) => {
            //     const {conversationId, searchedText} = data
            //     if(!conversationId) {
            //         callback(null, {
            //             status: 400,
            //             message: "Some Thing Was Wrong! Please refresh your page."
            //         })
            //         return
            //     } 
            //     await database.
            // })
            
            socket.on('disconnect', () => {
                const offlineDate = new Date()

                const userId = userIdStore[socket.id]
                userIdStore[socket.id] = undefined
                socketIdStore[userId] = undefined

                sendOfflineStatusToContacts(userId, offlineDate)
                database.updateUserLastSeen(userId, offlineDate)
                console.log(socket.id)
            })

            async function sendOfflineStatusToContacts(userId, offlineDate) {
                const contacts = await database.getUserContacts(userId)
                if(!contacts) return 
                contacts.forEach(contact => {
                    if(isOnlie(contact._id)) {
                        io.to(socketIdStore[contact._id.toString()]).emit('online', {
                            contactId: userId, 
                            lastSeen: offlineDate,
                            online: false
                        })
                    }
                })
            }
        })
    }
}

const socket = new Socket()
module.exports = socket