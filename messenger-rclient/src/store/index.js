import {configureStore} from '@reduxjs/toolkit'
import chatSlice from './chat/chat-slice'
import errorSlice from './error/error-slice'

const store = configureStore({
    reducer: {
        chat: chatSlice.reducer,
        error: errorSlice.reducer
    }
})

export default store