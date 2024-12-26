import { useRef, useState } from 'react'
import sendIcon from '../../../../img/send-icon.png'
import socket from '../../../../services/socket'
import { useDispatch, useSelector } from 'react-redux'
import { chatActions } from '../../../../store/chat/chat-slice'
import styles from './ChatBar.module.css'
import Input from '../../../../components/shared/Input/Input'
import config from '../../../../config'

export default function ChatBar({ conversationId }) {
    const dispatch = useDispatch()
    const userId = useSelector(store => store.chat.userId)
    const messageInputRef = useRef()
    const fileInputRef = useRef()
    const [isSendingQueue, setIsSendingQueue] = useState(false)
    
    function sendMessage() {
        const text = messageInputRef.current.value
        const files = fileInputRef.current.files.length? [...fileInputRef.current.files]: []
        if(!text && !files.length) return
        messageInputRef.current.value = ''
        fileInputRef.current.value = ''

        const tempMessage = {
            conversationId,
            senderId: userId,
            text,
            files
        }
        
        setIsSendingQueue(true)
        socket.sendMessage(tempMessage, (message) => {
            dispatch(chatActions.reciveNewMessage(message))
            setIsSendingQueue(false)
        })
    }

    function onMessageStartTyping() {
        socket.onTyping(conversationId, () => {
            console.log('on typing was emitted!')
        })
    }

    function onMessageInputKeyPress(event) {
        if(event.key === 'Enter') {
            sendMessage()
        }
    }

    function onMessageEndTyping() {
        socket.offTyping(conversationId, () => {
            console.log('off typing was emitted!')
        })
    }

    return (
        <div className={styles['chat__bar']}>
            <input ref={fileInputRef} type="file" id="message-document-input" disabled={isSendingQueue} alt="document icon" className={styles['document-icon'] + ' ' + styles['icon']} />
            <label htmlFor="message-document-input" className={styles['document-label']}>
            </label>
            <Input 
                ref={messageInputRef}
                className={styles['chat__input']}
                placeholder="type..." 
                disabled={isSendingQueue} 
                onKeyDown={onMessageInputKeyPress}
                onStartTyping={onMessageStartTyping}
                onEndTyping={onMessageEndTyping}
                endAfterLastClickTime={config.CHANGE_IS_TYPING_STATUS_DELAY}
            />
            
            <img src={sendIcon} alt="send icon" className={styles['send-icon'] + ' ' + styles['icon']} onClick={sendMessage} disabled={isSendingQueue}/>
        </div>
    )
}