import React, { useState } from 'react';
import googlelogo from '../../assets/google.png';
import vklogo from '../../assets/vk.png';
import facebooklogo from '../../assets/facebook.png';
import { Link } from 'react-router-dom';

import './Registration.scss';


export const Registration: React.FC = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [rpassword, setRpassword] = useState('');
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        rpassword: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // if (loading) return;

        let valid = true;
        // sanitize
        const loginText = login.trim();
        const passwordText = password.trim();
        const rpasswordText = rpassword.trim();

        const errors = {
            email: '',
            password: '',
            rpassword: ''
        }

        // валидация
        if (!(window as any).is.email(loginText)) {
            errors.email = 'email не по формату';
            valid = false;
        }

        if(passwordText.length < 6) {
            errors.password = 'пароль не короче 6 символов';
            valid = false;
        }

        if(rpasswordText !== passwordText) {
            errors.rpassword = 'пароли должны совпадать';
            valid = false;
        }

        if (valid) {
            // вход через сервер
        } else {
            setErrors(errors);
        }
    }

    return (
        <div className="registration-page">
            <div className="container">
                <div className="title">Регистрация</div>

                <div className="error"></div>
                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label>
                            <input
                                type="text"
                                placeholder=" "
                                className="input-group__input"
                                name="email"
                                value={login}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogin(e.target.value)} />
                            <p className="input-group__title">Эл. почта</p>
                        </label>
                        <div className="input-group__error">
                            {errors.email}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>
                            <input
                                type="text"
                                placeholder=" "
                                className="input-group__input"
                                name="password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                            <p className="input-group__title">Пароль</p>
                        </label>
                        <div className="input-group__error">
                            {errors.password}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>
                            <input
                                type="text"
                                placeholder=" "
                                className="input-group__input"
                                name="retrypassword"
                                value={rpassword}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRpassword(e.target.value)} />
                            <p className="input-group__title">Пароль ещё раз</p>
                        </label>
                        <div className="input-group__error">
                            {errors.rpassword}
                        </div>
                    </div>

                    <button className="button button--app" type="submit">Регистрация</button>
                </form>

                <div className="socials">
                    <div className="socials__title">регистрация через соцсети</div>

                    <div className="socials__networks">
                        <div className="socials__item">
                            <img src={googlelogo} alt="google" />
                        </div>
                        <div className="socials__item">
                            <img src={vklogo} alt="vk" />
                        </div>
                        <div className="socials__item">
                            <img src={facebooklogo} alt="facebook" />
                        </div>
                    </div>

                    <div className="socials__notice">
                        Уже есть аккаунт? <Link className="socials__link" to="/login">Войти</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}