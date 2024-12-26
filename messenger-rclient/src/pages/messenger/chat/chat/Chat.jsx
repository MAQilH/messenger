import ChatHeader from '../chatHeader/ChatHeader'
import ChatBody from '../chatBody/ChatBody'
import ChatBar from '../chatBar/ChatBar'
import { useEffect } from 'react'
import socket from '../../../../services/socket'
import { useParams } from 'react-router-dom'
import store from '../../../../store'
import { chatActions } from '../../../../store/chat/chat-slice'
import styles from './Chat.module.css'
import { useDispatch } from 'react-redux'


export default function Chat() {
    const {conversationId} = useParams()
    const dispatch = useDispatch()
    useEffect(() => {
        if(!conversationId) return 
        const fetchConversationData = async () => {
            const contactId = await new Promise((res, rej) => {
                socket.getContactIdInConversation(conversationId, (contactId) => {
                    res(contactId)
                }) 
            })
            socket.getUserWithUserId(contactId, (data) => {
                data.conversationId = conversationId
                dispatch(chatActions.setCurrentConversationData(data))
            })
        }
        fetchConversationData()
    }, [conversationId])
    
    return (
        <div className={`${styles['chat-container']}`}>
            <ChatHeader />
            <ChatBody conversationId={conversationId} />
            <ChatBar conversationId={conversationId} />
        </div>
    )
}