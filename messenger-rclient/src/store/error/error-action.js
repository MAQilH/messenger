import { generateSecureRandomId } from "../../utils/random"
import { errorActions } from "./error-slice"

export const createNewError = (errorMessage) => {
    return (dispatch) => {
        dispatch(errorActions.pushError({
            id: generateSecureRandomId(),
            message: errorMessage
        }))
    }
}

