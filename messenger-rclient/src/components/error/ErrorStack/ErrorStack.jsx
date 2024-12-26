import { useSelector } from "react-redux";
import ErrorCard from "../ErrorCard/ErrorCard";
import styles from './ErrorStack.module.css'


export default function ErrorStack() {
    const errors = useSelector(state => state.error.errors)
    let lastErrors = errors
    if(errors.length > 5) lastErrors = errors.slice(-5)
    return ( 
        <ul className={styles['error-list']}>
            {lastErrors.map(error => <ErrorCard key={error.id} error={error}/>)}
        </ul>
    )
}