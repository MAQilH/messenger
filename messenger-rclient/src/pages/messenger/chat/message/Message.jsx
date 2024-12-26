import SyncIcon from '../../../../img/sync-icon.png'
import SeenIcon from '../../../../img/seen-icon.png'
import UnseenIcon from '../../../../img/unseen-icon.png'
import { useSelector } from "react-redux"
import styles from './Message.module.css'
import { converTimeStrToHourAndMin } from '../../../../utils/date'

export default function Message({data}) {
    const userId = useSelector(store => store.chat.userId)
    const isMyMessage = userId === data.senderId

    let icon
    if(data.seened == undefined) icon = SyncIcon
    else if(data.seened) icon = SeenIcon
    else icon = UnseenIcon

    return (
        <div className={`${styles['chat__message']} ${styles[`chat__message--${isMyMessage? 'self': 'other'}`]}`} data-id={data._id}>
            {
                data.urls ? 
                data.urls.map((imageUrl, index) => 
                    <img key={index} src={imageUrl} alt="" className={styles['chat__message-image']} />
                ): ''
            }
            <p className={styles['chat__message__text']}>
                {data.text}
            </p>
            <div className={styles['chat__message-detail']}>
                <span className={styles['chat__message__date']}>{converTimeStrToHourAndMin(data.createdAt)}</span>
                {isMyMessage? <img src={icon} className={styles['status-icon'] + ' ' + styles['icon']} />: ''}
            </div>
        </div>
    )
}