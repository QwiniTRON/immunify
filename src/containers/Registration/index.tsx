import React, { useState } from 'react';
import googlelogo from '../../assets/google.png';
import vklogo from '../../assets/vk.png';
import facebooklogo from '../../assets/facebook.png';
import { Link } from 'react-router-dom';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';

import { useServer } from '../../hooks/useServer';
import { useAccessToken } from '../../hooks/';

import { Register, ExternalRegister, ExternalAuth } from '../../server';

import './Registration.scss';
import { useForm } from 'react-hook-form';
import { GeneratePassword } from '../../utils';
import VkLogin from 'react-vkontakte-login';
import { UserModel } from '../../models/User/User';
import { LoginMark, LoginTypeEnum } from '../../models';

type Form = {
    username: string,
    password: string,
    confirmPassword: string,
    personality: boolean,
}

export const Registration: React.FC = () => {
    const { set: setToken } = useAccessToken();

    const registerFetcher = useServer(Register);
    const externalFetcher = useServer(ExternalRegister);

    const [personality, setPersonality] = useState(false);

    const {
        register,
        handleSubmit,
        errors,
        getValues,
    } = useForm<Form>();

    const onSubmit = (data: Form) => {


        registerFetcher.fetch({
            username: data.username,
            password: data.password,
        });
    }

    const loading = registerFetcher.state.fetching || externalFetcher.state.fetching;
    const successRegister = !loading && registerFetcher.state.answer.succeeded;
    const successExternal = !loading && externalFetcher.state.answer.succeeded;
    const error = !loading && (registerFetcher.state.answer.errorMessage || externalFetcher.state.answer.errorMessage || "");

    if (successRegister) {
        UserModel.CurrentUserEmail = new LoginMark(LoginTypeEnum.Simple, getValues().username).toJSON();
        UserModel.chekUserEmail();

        setToken(registerFetcher.state.answer.data?.token || "");

        registerFetcher.reload();
    }

    if (successExternal) {
        UserModel.chekUserEmail();

        setToken(externalFetcher.state.answer.data?.token || "");

        externalFetcher.reload();
    }

    const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {

        function isGoogleResponse(obj: any): obj is GoogleLoginResponse {
            return obj.profileObj !== undefined;
        }

        if (isGoogleResponse(response)) {
            UserModel.CurrentUserEmail = new LoginMark(LoginTypeEnum.Google, response.profileObj.email).toJSON();

            GeneratePassword(response.googleId).then(pass => {
                externalFetcher.fetch({
                    username: response.googleId + 'Google',
                    password: pass,
                    externalAuth: ExternalAuth.Google,
                    identity: response.googleId,
                });
            })
        }
    }

    const failureResponseGoogle = (response: GoogleLoginResponse): void => {
        // Show error maybe?
        console.log(response.profileObj.googleId);
    }

    const facebookCallback = (userInfo: any): void => {
        if (userInfo.userID !== undefined) {
            UserModel.CurrentUserEmail = new LoginMark(LoginTypeEnum.Facebook, userInfo.profileObj.email).toJSON();

            GeneratePassword(userInfo.userID).then(pass => {
                externalFetcher.fetch({
                    username: userInfo.userID + 'Facebook',
                    password: pass,
                    externalAuth: ExternalAuth.Facebook,
                    identity: userInfo.userID,
                });
            })
        }
    }

    const vkCallback = (userInfo: any): void => {
        if (userInfo.session !== undefined) {
            UserModel.CurrentUserEmail = new LoginMark(LoginTypeEnum.VK, userInfo.session.user.href).toJSON();
            
            console.log(userInfo);
            

            GeneratePassword(userInfo.session.user.id).then(pass => {
                externalFetcher.fetch({
                    username: userInfo.session.user.id + 'VK',
                    password: pass,
                    externalAuth: ExternalAuth.VK,
                    identity: userInfo.session.user.id,
                });
            })
        }
    }

    return (
        <div className="registration-page">
            <div className="container">
                <div className="title">Регистрация</div>

                <div className="error">{error}</div>
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="input-group">
                        <label>
                            <input
                                type="text"
                                placeholder=" "
                                className="input-group__input"
                                name="username"
                                ref={register({ required: true, minLength: 4, maxLength: 20 })}
                            />
                            <p className="input-group__title">Логин</p>
                        </label>
                        <div className="input-group__error">
                            {errors.username?.type === 'required' && 'Это поле обязательно'}
                            {errors.username?.type === 'minLength' && 'Минимальная длинна поля - 4 символа'}
                            {errors.username?.type === 'maxLength' && 'Максимальная длинна поля - 20 символа'}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>
                            <input
                                type="password"
                                placeholder=" "
                                className="input-group__input"
                                name="password"
                                ref={register({ required: true, minLength: 4, maxLength: 20 })}
                            />
                            <p className="input-group__title">Пароль</p>
                        </label>
                        <div className="input-group__error">
                            {errors.password?.type === 'required' && 'Это поле обязательно'}
                            {errors.password?.type === 'minLength' && 'Минимальная длинна поля - 4 символа'}
                            {errors.password?.type === 'maxLength' && 'Максимальная длинна поля - 20 символа'}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>
                            <input
                                type="password"
                                placeholder=" "
                                className="input-group__input"
                                name="confirmPassword"
                                ref={register({ required: true, minLength: 4, maxLength: 20, validate: (value) => getValues().password === value, })}
                            />
                            <p className="input-group__title">Пароль ещё раз</p>
                        </label>
                        <div className="input-group__error">
                            {errors.confirmPassword?.type === 'required' && 'Это поле обязательно'}
                            {errors.confirmPassword?.type === 'minLength' && 'Минимальная длинна поля - 4 символа'}
                            {errors.confirmPassword?.type === 'maxLength' && 'Максимальная длинна поля - 20 символа'}
                            {errors.confirmPassword?.type === 'validate' && 'Поля должны совпадать'}
                        </div>
                    </div>

                    <button className="button button--app" disabled={loading} type="submit">Регистрация</button>
                </form>

                <div className="socials">
                    <div className="socials__title">регистрация через соцсети</div>

                    <div className="socials__networks">
                        <div className="socials__item">
                            <GoogleLogin
                                clientId="830770546293-pu13vb9rsqgbh1u4oklhg47p3humh3gr.apps.googleusercontent.com"
                                buttonText="Login"
                                onSuccess={responseGoogle}
                                onFailure={failureResponseGoogle}
                                render={props => (
                                    <button {...props} style={{ background: 'none', border: 'none' }}>
                                        <img src={googlelogo} alt="google" />
                                    </button>
                                )}
                                cookiePolicy='single_host_origin'
                            />
                        </div>
                        <div className="socials__item">
                            <VkLogin
                                apiId="7707005"
                                callback={vkCallback}
                                render={(renderProps: any) => (
                                    <button {...renderProps} style={{ background: 'none', border: 'none' }}>
                                        <img src={vklogo} alt="vk" />
                                    </button>
                                )}
                            />
                        </div>
                        <div className="socials__item">
                            <FacebookLogin
                                appId="438469453977207"
                                callback={facebookCallback}
                                render={(renderProps: any) => (
                                    <button onClick={renderProps.onClick} style={{ background: 'none', border: 'none' }}>
                                        <img src={facebooklogo} alt="facebook" />
                                    </button>
                                )}
                            />
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