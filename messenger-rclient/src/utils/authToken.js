export function getAuthToken() {
    return localStorage.getItem('token')
}

export function setAuthToken(newToken) {
    localStorage.setItem('token', newToken)
}