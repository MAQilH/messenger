import { useEffect, useRef } from "react"
import socket from "../../../../services/socket"
import { useDispatch, useSelector } from "react-redux"
import { chatActions } from "../../../../store/chat/chat-slice"
import Message from "../message/Message"
import styles from './ChatBody.module.css'
import config from "../../../../config"

export default function ChatBody({conversationId}) {
    const dispatch = useDispatch()
    const {currentConversationMessages, userId} = useSelector(state => {
        return {
            currentConversationMessages: state.chat.currentConversationMessages,
            userId: state.chat.userId
        }
    })

    const containerRef = useRef()
    const isLoadingRemainMessageRef = useRef(false)

    useEffect(() => {
        socket.loadUpMessage(conversationId, null, config.MAX_LOAD_MESSAGE, (conversationMessages) => {
            dispatch(chatActions.setCurrentConversationMessages(conversationMessages))
        })
    }, [conversationId])
    
    const lastMessage = currentConversationMessages.length? currentConversationMessages[currentConversationMessages.length - 1]: null 

    useEffect(() => {
        console.log('this called')
        containerRef.current.scrollTop = containerRef.current.scrollHeight
        seenLastMessage()
    }, [lastMessage])

    function seenLastMessage() {
        if(currentConversationMessages.length) {
            const lastMessage = currentConversationMessages[currentConversationMessages.length - 1]
            if(lastMessage.senderId !== userId && !lastMessage.seened) {
                socket.seenConversationMessages(conversationId, (res) => {
                    console.log(`result of seen last message: ${res}`)
                    dispatch(chatActions.setUnseenNumberMessage({
                        conversationId,
                        newUnseenNumber: 0
                    }))
                })
            }
        }
    }

    function chatBodyOnScrollHandler(event) {
        const scrollTop = event.currentTarget.scrollTop
        const scrollHeight = event.currentTarget.scrollHeight
        const clientHeight = event.currentTarget.clientHeight
        const scrollBottom = scrollHeight - scrollTop - clientHeight
        containerRef.current.scrollTop = Math.max(1, containerRef.current.scrollTop)
        if(scrollTop < config.REMAIN_SCROLL_TOP_LOAD_THERSHOULD) {
            loadRemainMessagesFromUp()
        }
        if(scrollBottom < config.REMAIN_SCROLL_TOP_LOAD_THERSHOULD) {
            loadRemainMessagesFromDown()
        }
    }

    function loadRemainMessagesFromUp() {
        if(isLoadingRemainMessageRef.current) return
        isLoadingRemainMessageRef.current = true
        const lastMessageId = currentConversationMessages.length? currentConversationMessages[0]._id: null
        socket.loadUpMessage(conversationId, lastMessageId, config.MAX_LOAD_MESSAGE, (conversationMessages) => {
            dispatch(chatActions.pushMessagesToFrontOfConversation(conversationMessages))
            isLoadingRemainMessageRef.current = false
        })
    }

    function loadRemainMessagesFromDown() {
        if(isLoadingRemainMessageRef.current) return
        isLoadingRemainMessageRef.current = true
        const firtMessageId = currentConversationMessages.length? currentConversationMessages[currentConversationMessages.length - 1]._id: null
        socket.loadDownMessage(conversationId, firtMessageId, config.MAX_LOAD_MESSAGE, (conversationMessages) => {
            dispatch(chatActions.pushMessagesToBackOfConversation(conversationMessages))
            isLoadingRemainMessageRef.current = false
        })
    }

    return (
        <div ref={containerRef} className={styles['chat__body']} onScroll={chatBodyOnScrollHandler}>
            {
                currentConversationMessages.map(messageData => {
                    return <Message key={messageData._id} data={messageData} fromMe={messageData}/>
                })
            }
        </div>
    )
}