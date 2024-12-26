import { Form, json, NavLink, redirect, useActionData } from 'react-router-dom'
import loginIcon from '../../../img/login-icon.png'
import { setAuthToken } from '../../../utils/authToken'
import styles from './LoginForm.module.css'
import { sendPostRequest } from '../../../services/api'

export default function LoginForm() {
    const actionData = useActionData()
    const error = actionData?.error

    return (
        <div className={'card' + ' ' + styles['login-card']}>
            <Form method="POST">
                <img src={loginIcon} alt="login image" className="card-img" />
                <div className="input-field">
                    <input type="text" name="username" placeholder="" id="username" minLength="3" required />
                    <label htmlFor="username">Username</label>
                </div>
                <div className="input-field">
                    <input type="password" placeholder="" name="password" id="password" minLength="4" required />
                    <label htmlFor="password">Password</label>
                </div>
                <span className={`error ${!error && 'hidden'}`}>{error?.message}</span>
                <button type="submit hidden" className="btn__submit">Login</button>
            </Form>
            <NavLink to="/auth/register" className="naviaget-link">create new account</NavLink>
        </div>
    )
}

export async function LoginAction({ request }) {
    const formData = await request.formData()
    const username = formData.get('username')
    const password = formData.get('password')
    const userLoginData = {
        username,
        password
    }

    try {
        const loginResponse = await sendPostRequest('login', userLoginData)
        setAuthToken(loginResponse.token)
        return redirect('/')
    } catch (error) {
        return json({
            error:{
                message: error.message
            }
        }, {status: 400})
    }
}