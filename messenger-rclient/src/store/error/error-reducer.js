export default {
    removeErrorWithErrorId(state, action) {
        const errorId = action.payload
        state.errors = state.errors.filter(error => error.id !== errorId)
    },
    pushError(state, action) {
        const error = action.payload
        state.errors.push(error)
    },
    clearErrors(state, action) {
        state.errors = []
    }
}