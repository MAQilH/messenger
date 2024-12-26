import { Form, json, NavLink, redirect, useActionData } from "react-router-dom";
import registerIcon from '../../../img/register-icon.png'
import styles from './RegisterForm.module.css'
import { sendPostRequest } from "../../../services/api";

export default function RegisterForm() {
    const actionData = useActionData()
    const error = actionData?.error

    return (
        <div className={'card' + ' ' + styles['register-card']}>
            <Form method="POST">
                <img src={registerIcon} alt="register image" className="card-img" />
                <div className="input-field">
                    <input type="text" name="username" placeholder="" id="username" minLength="3" required />
                    <label htmlFor="username">Username</label>
                </div>
                <div className="input-field">
                    <input type="email" name="email" placeholder="" id="email" required />
                    <label htmlFor="email">Email</label>
                </div>
                <div className="input-field">
                    <input type="password" placeholder="" name="password" id="password" minLength="4" required />
                    <label htmlFor="password">Password</label>
                </div>
                <div className="input-field">
                    <input type="password" placeholder="" id="confirm-password" name="confirmPassword" minLength="4" required />
                    <label htmlFor="confirm-password">Confirm Password</label>
                </div>
                <span className={`error ${!error && 'hidden'}`}>{error?.message}</span>
                <button type="submit hidden" className="btn__submit">Register</button>
            </Form>
            <NavLink to="/auth/login" className="naviaget-link">already have an account?</NavLink>
        </div>
    )
}

export async function RegisterAction({ request }) {
    const formData = await request.formData()
    const username = formData.get('username')
    const password = formData.get('password')
    const email = formData.get('email')
    const confirmPassword = formData.get('confirmPassword')

    console.log(username, password, confirmPassword)

    let error = null
    if (confirmPassword !== password) {
        error = 'Password and Confirm Password must be match!'
    }

    if(error) {
        return json({error: {
            message: error
        }}, {status: 500})
    }

    const userRegisterData = {
        username,
        password,
        email
    }

    try {
        const response = await sendPostRequest('register', userRegisterData)
        return redirect('/auth/login')
    } catch(error) {
        return json({
            error: {
                message: error.message
            }
        }, {status: 400})
    }
}