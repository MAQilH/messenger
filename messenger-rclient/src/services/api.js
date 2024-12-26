import config from "../config"
import { getAuthToken } from "../utils/authToken"

export async function sendGetRequest(url) {
    let response, responseData
    try {
        const headers = {
            'Content-Type': 'application/json'
        }
        appendAuthTokenToHeader(headers)
        response = await fetch(`${config.BASE_URL}/${url}`, {
            method: 'GET',
            headers
        })
        responseData = await response.json()
    } catch {
        throw new Error('Check your network connection!')
    }
    if(!response.ok) {
        throw new Error('Something was wrong!')
    }
    if(responseData.status && responseData.status !== 200) {
        throw new Error(responseData.message || 'Something was wrong!')
    }
    return responseData
}

function appendAuthTokenToHeader(headers) {
    const token = getAuthToken()
    if(token) headers['authorization'] = token
}

export async function sendPostRequest(url, data) {
    let response, responseData
    try {
        response = await fetch(`${config.BASE_URL}/${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        responseData = await response.json()
    } catch(error) {
        throw new Error('Check your network connection!')
    }
    if(!response.ok || (response.status && response.status !== 200)) {
        throw new Error(responseData.msg || 'Something was wrong!')
    }
    return responseData
}