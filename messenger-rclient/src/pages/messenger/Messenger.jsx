import { Outlet, redirect } from "react-router-dom"
import SideBar from "./conversation/sideBar/SideBar"
import store from "../../store"
import { useEffect } from "react"
import socket from "../../services/socket"
import { chatActions } from "../../store/chat/chat-slice"
import styles from './Messenger.module.css'
import ErrorStack from "../../components/error/ErrorStack/ErrorStack"
import { createNewError } from "../../store/error/error-action"
import { useDispatch } from "react-redux"
import { sendGetRequest } from "../../services/api"

export default function Messenger() {
    const dispatch = useDispatch()
    
    function sortConversations(conversations) {
        const sortedConversationList = conversations.sort((firstConversation, secondConversation) => {
            if(!firstConversation.lastMessage) return 1
            if(!secondConversation.lastMessage) return -1
            const fristDate = new Date(firstConversation.lastMessage.createdAt)
            const secondDate = new Date(secondConversation.lastMessage.createdAt)
            if(fristDate < secondDate) return 1
            return -1;
        })
        return sortedConversationList
    }

    
    useEffect(() => {
        socket.userContacts((res) => {
            const sortedConversationList = sortConversations(res)
            dispatch(chatActions.setConversationList(sortedConversationList))
        })
    }, [])

    return (
        <div className={styles['main']}>
            <div className={styles['errors-container']}>
                <ErrorStack />
            </div>
            <SideBar />
            <Outlet />
        </div>
    )
}

async function validateAuthToken() {
    try {
        const response = await sendGetRequest('verifyToken')
        return response != null
    } catch (error){
        store.dispatch(createNewError(error.message))
        return false
    }
}

export async function messengerLoader() {
    const validateAuthTokenRes = await validateAuthToken()
    console.log('messenger loader loaded!', validateAuthTokenRes)
    if(!validateAuthTokenRes) {
        return redirect('/auth/login')
    }
    try {
        await new Promise((res, rej) => {
            socket.connect((userId) => {
                store.dispatch(chatActions.setUserId(userId))
                res()
            })
        })
    } catch {
        console.error('something was wrong in conecting to the messenger socket!')
        return redirect('/auth/login')
    }
    return null 
}

export async function conversationLoader({ params }) {
    const {conversationId} = params
    const {verify} = await new Promise((resolve, _) => {
        socket.conversationVerify(conversationId, null, (res) => {
            resolve(res)
        })
    })
    if(!verify) {
        store.dispatch(createNewError('This Conversation doesn\'t Exist!'))
        return redirect('/')
    }
    return null
}