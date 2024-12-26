import API from '../api'
import RegisterView from '../view/registerView'
import router from '../router'

class RegisterController {
    _registerView

    init() {
        this._registerView = new RegisterView()
        this._registerView.render(document.body)
        this._registerView.addRegisterHandler(this.formSubmit.bind(this))
    }

    async formSubmit(event) {
        event.preventDefault()
        this._registerView.clearError()

        const data = this._getFormData(event.target)

        const err = this._validateForm(data)
        if(err) {
            this._registerView.showError(err)
            return
        }

        const result = await this._sendRegisterRequest(data)
        console.log(result)
        if(result.status !== 200) {
            this._registerView.showError(result.msg)
            return
        }
        router.redirect('/login')
    }

    _getFormData(form) {
        const formData = new FormData(form)
        return Object.fromEntries(formData.entries())
    }

    _validateForm(data) {
        if(data.password !== data.confirmPassword) {
            return 'password and confirm password must be matched!'
        }
        return null
    }

    async _sendRegisterRequest(data) {
        const result = await API.sendPostRequest('/register', data)
        console.log(result)
        const resData = await result.json()
        resData.status = result.status
        return resData
    }

    close() {
        this._registerView.close()
    }
}

export default RegisterController