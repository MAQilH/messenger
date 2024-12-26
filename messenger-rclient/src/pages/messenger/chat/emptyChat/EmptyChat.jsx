import styles from './EmptyChat.module.css'


export default function EmptyChat() {
    return (
        <div className={styles['empty-chat-container'] + ' ' + '--deactive'}>
            <div className={styles['message-card']}>
                <h4>Select a chat to start messaging</h4>
            </div>
        </div>
    )
}