// eslint-disable-next-line import/no-anonymous-default-export
export default {
    setUserId(state, action) {
        state.userId = action.payload
    },
    setConversationList(state, action) {
        state.conversationList = action.payload
    },
    setCurrentConversationMessages(state, action) {
        state.currentConversationMessages = action.payload
    },
    setCurrentConversationData(state, action) {
        state.currentConversationData = action.payload
    },
    pushMessagesToFrontOfConversation(state, action) {
        const messages = action.payload
        state.currentConversationMessages = [
            ...messages,
            ...state.currentConversationMessages
        ]
    },
    pushMessagesToBackOfConversation(state, action) {
        const messages = action.payload
        state.currentConversationMessages = [
            ...state.currentConversationMessages,
            ...messages
        ]
    },
    reciveNewMessage(state, action) {
        const message = action.payload 
        
        // insert to the current conversation message
        if(state.currentConversationData.conversationId === message.conversationId) {
            state.currentConversationMessages.push(message)
        }

        // update conversation list last message
        console.log(state.conversationList[0].conversationId, message.conversationId)
        const conversation = state.conversationList.find(conversationListItem => {
            return conversationListItem.conversationId === message.conversationId
        })
        if(!conversation) {
            console.error('conversation not found in the conversation list')
            return
        }

        conversation.lastMessage = message
        if(message.senderId !== state.userId){
            conversation.unseen++
        }
        
        // reorder conversations in conversation list
        state.conversationList = [
            conversation,
            ...state.conversationList.filter(conversationListItem => conversationListItem.conversationId !== conversation.conversationId)
        ] 
    },
    seenMessages(state, action) {
        const messages = action.payload
        messages.forEach(message => {
            if(message.conversationId !== state.currentConversationData.conversationId) return
            const realMessage = state.currentConversationMessages.find(conversationMessage => {
                return conversationMessage._id === message._id
            })
            if(!realMessage) {
                console.error('this message id wasn\'t found in this conversation')
                return
            } 
            realMessage.seened = true
        });
    },
    setConversationTypingStatus(state, action) {
        const conversationData = action.payload

        if(conversationData.conversationId === state.currentConversationData?.conversationId) {
            state.currentConversationData.typingStatus = conversationData.typingStatus
        }

        const conversation = state.conversationList.find(conversationListItem => {
            return conversationListItem.conversationId === conversationData.conversationId
        })

        if(!conversation) {
            console.warn('conversation not found for changin status!')
            return
        }
        conversation.typingStatus = conversationData.typingStatus
    },
    setUnseenNumberMessage(state, action) {
        const {conversationId, newUnseenNumber} = action.payload
        const conversation = state.conversationList.find(conversationListItem => {
            return conversationListItem.conversationId === conversationId 
        })
        if(!conversation) {
            console.error('conversation not found for changing unseen number')
            return
        }
        conversation.unseen = newUnseenNumber
    },
    setConversationOnlineStatus(state, action) {
        const {contactId, online: onlineStatus} = action.payload
        const conversation = state.conversationList.find(conversationListItem => {
            console.log(conversationListItem._id, contactId, onlineStatus)
            return conversationListItem._id === contactId
        })
        if(!conversation) {
            console.error('conversation for change online status not found!')
            return 
        }
        conversation.online = onlineStatus

        if(state.currentConversationData.conversationId === conversation.conversationId) {
            state.currentConversationData.online = onlineStatus
        }
    },
    insertNewConversation(state, action) {
        const conversation = action.payload
        conversation.unseen = 0
        state.conversationList = [conversation, ...state.conversationList]
    }
}