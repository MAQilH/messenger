import styles from './Header.module.css'

function Right({ children }) {
    return <div class="">{children}</div>
}
export default function Header({leftChildren, rightChildren , style}) {
    return (
        <div className={styles['header-container'] + ' ' + style}>
            <div className={styles['left-bar']}>
                {leftChildren}
            </div>
            <div className={styles['right-bar']}>
                {rightChildren}
            </div>
        </div>
    )
}

