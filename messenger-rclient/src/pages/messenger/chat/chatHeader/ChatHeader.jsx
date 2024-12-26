import { useSelector } from 'react-redux'
import backIcon from '../../../../img/back-icon.png'
import manIcon from '../../../../img/man.png'
import ContactStatus from '../contactStatus/ContactStatus'
import { useNavigate } from 'react-router-dom'
import styles from './ChatHeader.module.css'
import Header from '../../../../components/shared/Header/Header'

export default function ChatHeader() {
    const conversationData = useSelector(store => store.chat.currentConversationData)
    const navigate = useNavigate()

    function backClickHandler() {
        navigate('/')
    }

    return (
            <Header 
                leftChildren={
                    <div className={styles['contact-info']}>
                        <img className={styles['contact__img']} src={manIcon} alt="" />
                        <div className={styles['contact-detail']}>
                            <p className={styles['contact-name']}>{conversationData.username}</p>
                            <ContactStatus data={conversationData}/>
                        </div>
                    </div>
                }
                rightChildren={
                    <img src={backIcon} className={styles['menu-icon'] + ' ' + 'icon'} onClick={backClickHandler}/>
                }
                style={styles['chat__header']}
            />
    )
}