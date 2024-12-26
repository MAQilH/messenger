import { createSlice } from "@reduxjs/toolkit";
import chatReducer from './chat-reducer'

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        userId: null,
        conversationList: [],
        currentConversationMessages: [],
        currentConversationData: {}
    },
    reducers: chatReducer
})

export const chatActions = chatSlice.actions
export default chatSlice