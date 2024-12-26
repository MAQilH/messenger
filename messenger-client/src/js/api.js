import config from "./config"
import store from "./store"

class API {
    async sendPostRequest(url, data) {
        return fetch(`${config.BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': store.token
            },
            body: JSON.stringify(data)
        })
    }

    async sendGetRequest(url) {
        return fetch(`${config.BASE_URL}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': store.token
            }
        })
    }

    async verifyToken() {
        if(!store.token) return false
        const result = await this.sendGetRequest('/verifyToken')
        console.log(result)
        return result.status === 200
    }
}

export default new API()