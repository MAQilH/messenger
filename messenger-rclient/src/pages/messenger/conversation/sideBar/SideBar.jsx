import { useState } from "react";
import ConversationList from "../conversationList/ConversationList";
import SearchUser from "../searchUser/SearchUser";
import { useParams } from "react-router-dom";


export default function SideBar() {
    const [isSearchMode, setIsSearchMode] = useState(false)
    
    function toggleSearchMode() {
        setIsSearchMode(isSearchMode => !isSearchMode)
    }
    
    return (  
        isSearchMode ?
        <SearchUser close={toggleSearchMode}/> :
        <ConversationList openSearch={toggleSearchMode}/>
    )
}