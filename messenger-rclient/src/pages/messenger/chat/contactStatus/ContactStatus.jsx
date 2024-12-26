import { converTimeStrToHourAndMin } from "../../../../utils/date"
import styles from "./ContactStatus.module.css"

export default function ContactStatus({data}) {
    let statusClasses = styles['contact-status'] + ' '
    let statusContent

    if(data.typingStatus) {
        statusClasses += '--blue-color'
        statusContent = 'is typing...'
    } else if(data.online) {
        statusClasses += '--green-color'
        statusContent = 'online'
    } else {
        statusContent = converTimeStrToHourAndMin(data.lastSeen)
    }

    return <p className={statusClasses}>{statusContent}</p>
}