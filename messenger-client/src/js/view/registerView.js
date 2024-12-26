import registerIcon from "../../img/register-icon.png"
import config from "../config"

class RegisterView {
    _parent
    _registerForm
    _register
    _errorBox

    render(parent) {
        this._parent = parent
        this._parent.insertAdjacentHTML('beforeend', this._generateMarkup())

        this._register= this._parent.querySelector('.register')
        this._registerForm = this._parent.querySelector('form')
        this._errorBox = this._parent.querySelector('.error')
    } 

    _generateMarkup() {
        return `
            <div class="full-container full-container--center full-container--blue-gradiant register">
                <div class="card register-card">
                    <form action="${config.BASE_URL}/register" method="POST">
                        <img src="${registerIcon}" alt="register image" class="card-img">
                        <div class="input-field">
                            <input type="text" name="username" placeholder="" id="username" minlength="3" required>
                            <label for="username">Username</label>
                        </div>
                        <div class="input-field">
                            <input type="email" name="email" placeholder="" id="email" required>
                            <label for="email">Email</label>
                        </div>
                        <div class="input-field">
                            <input type="password" placeholder="" name="password" id="password" minlength="4" required>
                            <label for="password">Password</label>
                        </div>
                        <div class="input-field">
                            <input type="password" placeholder="" id="confirm-password" name="confirmPassword" minlength="4" required>
                            <label for="confirm-password">Confirm Password</label>
                        </div>
                        <span class="error hidden">asd</span>
                        <button type="submit hidden" class="btn__submit">Register</button>
                    </form>
                    <a href="/login" class="login-link">already have an account?</a>
                </div>
            </div>
        `
    }

    addRegisterHandler(handler) {
        this._registerForm.addEventListener('submit', handler)
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
        this._parent.removeChild(this._register)
    }
    
}

export default RegisterView