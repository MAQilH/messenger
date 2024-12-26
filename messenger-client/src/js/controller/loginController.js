import API from '../api'
import LoginView from '../view/loginView'
import store from '../store'
import router from '../router'

class LoginController {
    _loginView

    init() {
        this._loginView = new LoginView()
        this._loginView.render(document.body)
        this._loginView.addLoginHandler(this.formSubmit.bind(this))
    }

    async formSubmit(event) {
        event.preventDefault()
        this._loginView.clearError()

        const data = this._getFormData(event.target)

        const result = await this._sendRegisterRequest(data)
        if(result.status !== 200) {
            this._loginView.showError(result.msg)
            return
        }

        this._logedIn(result)
    }

    

    _logedIn(result) {
        console.log(result)
        store.token = result.token
        router.redirect('/')
    }

    _getFormData(form) {
        const formData = new FormData(form)
        return Object.fromEntries(formData.entries())
    }

    async _sendRegisterRequest(data) {
        const result = await API.sendPostRequest('/login', data)
        const resData = await result.json()
        resData.status = result.status
        return resData
    }

    close() {
        this._loginView.close()
    }
}

export default LoginController