import { useParams, useSearchParams } from 'react-router-dom'
import menuIcon from '../../../../img/menu-icon.png'
import searchIcon from '../../../../img/search-icon.png'
import { useSelector } from 'react-redux'
import UserCard from '../userCard/UserCard'
import styles from './ConversationList.module.css'
import Header from '../../../../components/shared/Header/Header'
import ConversationBody from '../conversationBody/ConversationBody'

export default function ConversationList({openSearch}) {
    const {conversationId} = useParams()

    return (
        <div className={styles['contact-container'] + ' ' + (conversationId? '--deactive': '')}>
            <Header 
                leftChildren={
                    <img src={menuIcon} className={styles['menu-icon'] + ' ' + styles['icon']} />
                }
                rightChildren={
                    <img src={searchIcon} className={styles['search-icon'] + ' ' + styles['icon']} onClick={openSearch}/>
                }
                style={styles['contact__header']}
            />
            <ConversationBody />
        </div>
    )
}