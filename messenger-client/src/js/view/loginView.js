import config from "../config"
import loginIcon from "../../img/login-icon.png"


class LoginView {
    _parent
    _loginForm
    _login
    _errorBox

    render(parent) {
        this._parent = parent
        this._parent.insertAdjacentHTML('beforeend', this._generateMarkup())

        this._login= this._parent.querySelector('.login')
        this._loginForm = this._parent.querySelector('form')
        this._errorBox = this._parent.querySelector('.error')
    }

    _generateMarkup() {
        return `
            <div class="full-container full-container--center full-container--blue-gradiant login">
                <div class="card login-card">
                    <form action="${config.BASE_URL}/login" method="POST">
                        <img src="${loginIcon}" alt="login image" class="card-img">
                        <div class="input-field">
                            <input type="text" name="username" placeholder="" id="username" minlength="3" required>
                            <label for="username">Username</label>
                        </div>
                        <div class="input-field">
                            <input type="password" placeholder="" name="password" id="password" minlength="4" required>
                            <label for="password">Password</label>
                        </div>
                        <span class="error hidden"></span>
                        <button type="submit hidden" class="btn__submit">Login</button>
                    </form>
                    <a href="/register" class="login-link">create new account</a>
                </div>
            </div>
        `
    }

    addLoginHandler(handler) {
        this._loginForm.addEventListener('submit', handler)
    }

    showError(msg) {
        this._errorBox.classList.remove('hidden')
        this._errorBox.innerHTML = msg
    }

    clearError() {
        this._errorBox.classList.add('hidden')
        this._errorBox.innerHTML = ''
    }

    close() {
        this._parent.removeChild(this._login)
    }
}

export default LoginView