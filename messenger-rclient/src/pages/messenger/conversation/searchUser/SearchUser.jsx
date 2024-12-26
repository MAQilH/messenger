import { useRef, useState } from 'react'
import closeIcon from '../../../../img/close-icon.png'
import socket from '../../../../services/socket'
import UserCard from '../userCard/UserCard'
import styles from './SearchUser.module.css'
import { useParams } from 'react-router-dom'
import Header from '../../../../components/shared/Header/Header'
import Input from '../../../../components/shared/Input/Input'
import config from '../../../../config'
import SearchBody from '../searchBody/SearchBody'

export default function SearchUser({close}) {
    const timeoutRef = useRef()
    const [currentSearchedUsers, setCurrentSearchedUsers] = useState([])
    const {conversationId} = useParams()

    function onEndSearchUser(event) {
        const { value } = event.target
        if(value) {
            socket.searchUsers(value, (data) => {
                setCurrentSearchedUsers(data)
            })
        }
    }

    return (
        <div className={styles['search-container'] + ' ' + (conversationId? '--deactive': '')}>
            <Header
                rightChildren={
                    <img className={styles['search__close-btn']} src={closeIcon} onClick={close} />
                }   
                leftChildren={
                    <Input 
                        className={styles['search__input']} 
                        placeholder="search..."
                        onEndTyping={onEndSearchUser} 
                        endAfterLastClickTime={config.SEARCH_USER_TYPING_DELAY}
                    />
                }
                style={styles['search__header']}
            />
            <SearchBody searchedUsers={currentSearchedUsers}/>
        </div>
    )
}