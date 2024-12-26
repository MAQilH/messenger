import { createSlice } from "@reduxjs/toolkit";
import errorReducer from "./error-reducer";

const errorSlice = createSlice({
    name: 'error',
    initialState: {
        errors: []
    },
    reducers: errorReducer
})

export const errorActions = errorSlice.actions
export default errorSlice