import { Outlet, redirect } from "react-router-dom";
import CenterContainer from "../../components/shared/CenterContainer/CenterContainer";
import styles from './Auth.module.css'

export default function Auth() {
    return (
        <CenterContainer style={styles['blue-gradient']}>
            <Outlet />
        </CenterContainer>
    )
}

export function authLoader() {
    return null
}