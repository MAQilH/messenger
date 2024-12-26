import { useSelector } from 'react-redux'
import styles from './ConversationBody.module.css'
import UserCard from '../userCard/UserCard'


export default function ConversationBody() {
    const conversationList = useSelector(state => state.chat.conversationList)

    return (
        <div className={styles['contact__body']}>
            {
                conversationList.map(conversationItemData => {
                    return <UserCard key={conversationItemData._id} data={conversationItemData}/>
                })
            }
        </div>
    )
} 