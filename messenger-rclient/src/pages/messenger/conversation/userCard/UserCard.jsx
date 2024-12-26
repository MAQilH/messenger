import { useSelector } from 'react-redux'
import manIcon from '../../../../img/man.png'
import socket from '../../../../services/socket'
import { useNavigate } from 'react-router-dom'
import { converTimeStrToHourAndMin } from '../../../../utils/date'
import styles from './UserCard.module.css'

export default function UserCard({ data }) {
    const navigate = useNavigate()

    const userId = useSelector((state) => state.chat.userId)
    const { _id: contactId } = data

    function startConversation() {
        socket.getConversationId(userId, contactId, (conversationId) => {
            navigate(`/${conversationId}`)
        })
    }

    return (
        <div className={styles['user-card']} onClick={startConversation}>
            <div className={styles['user-card__img-container']}>
                <img src={manIcon} alt="user image" className={styles['user-card__img']} />
                <div className={`${styles['user-card__online']} ${data.online? '': 'hidden'}`}></div>
            </div>
            <div className={styles['user-card-detail']}>
                <p className={styles['user-card-name']}>{data.username ?? ''}</p>
                {
                    data.typingStatus? 
                    <p className={styles['user-card__is-typeing']}>is typeing...</p> :
                    <p className={styles['user-card__message']}>{data.lastMessage? data.lastMessage.text: ''}</p>
                }
            </div>
            <div className={styles['user-card__message-detail']}>
                <span className={styles['user-card__last-message-date']}>{data.lastMessage?.createdAt? converTimeStrToHourAndMin(data.lastMessage?.createdAt): ''}</span>
                <div className={`${styles['user-card__badage']} ${data.unseen? '': 'hidden'}`}><span className={styles['user-card__badage-value']}>{data.unseen ?? ''}</span></div>
            </div>
        </div>
    )
}