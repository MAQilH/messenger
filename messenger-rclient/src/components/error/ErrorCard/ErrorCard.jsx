import { useDispatch } from "react-redux";
import { errorActions } from "../../../store/error/error-slice";

import styles from './ErrorCard.module.css'
import closeIcon from '../../../img/close-icon.png'

export default function ErrorCard({error}) {
    const dispatch = useDispatch()

    function closeHandler() {
        dispatch(errorActions.removeErrorWithErrorId(error.id))
    }

    return (
        <div class={styles['error-card']}>
            <p className={styles['message']}>{error.message}</p>
            <img className={styles['close-btn']} src={closeIcon} onClick={closeHandler} />
        </div>
    )
}