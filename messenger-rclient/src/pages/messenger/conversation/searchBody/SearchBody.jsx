import UserCard from "../userCard/UserCard"
import styles from "./SearchBody.module.css"

export default function SearchBody({searchedUsers}) {
    return (
        <div className={styles['search__body']}>
            {searchedUsers.map(searchedUser => {
                return <UserCard key={searchedUser._id} data={searchedUser} />
            })}
        </div>
    )
}