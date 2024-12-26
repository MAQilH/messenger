export default function CenterContainer({ children, style }) {
    return (
        <div className={`full-container full-container--center ${style}`}>
            {children}
        </div>
    )
}