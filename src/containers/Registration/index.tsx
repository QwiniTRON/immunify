import React from 'react';
import googlelogo from '../../assets/google.png';
import vklogo from '../../assets/vk.png';
import facebooklogo from '../../assets/facebook.png';
import { Link } from 'react-router-dom';
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';

import { useServer } from '../../hooks/useServer';
import { useAccessToken } from '../../hooks/useAccessToken';

import { Register, ExternalRegister, ExternalAuth } from '../../server';

import './Registration.scss';
import { useForm } from 'react-hook-form';
import { GeneratePassword } from '../../utils';

type Form = {
  username: string,
  password: string,
  confirmPassword: string,
}

export const Registration: React.FC = () => {
    const { set: setToken } = useAccessToken();
    const registerFetcher = useServer(Register);
    const externalFetcher = useServer(ExternalRegister); 

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
        setToken(registerFetcher.state.answer.data?.token || "");
        window.location.href = "/profile";
        registerFetcher.reload();
    }  

    if (successExternal) {
        setToken(externalFetcher.state.answer.data?.token || "");
        window.location.href = "/profile";
        externalFetcher.reload();
    }
  
    const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {
  
      function isGoogleResponse(obj: any): obj is GoogleLoginResponse {
        return obj.profileObj !== undefined;
      }
  
      if (isGoogleResponse(response)) {
        GeneratePassword(response.googleId).then(pass => {
            console.log({
                username: response.googleId + 'Google',
                password: pass,
                externalAuth: ExternalAuth.Google,
                identity: response.googleId,
            });
            
            externalFetcher.fetch({
                username: response.googleId + 'Google',
                password: pass,
                externalAuth: ExternalAuth.Google,
                identity: response.googleId,
            });
        })
      }
    }
    
    const failureResponse = (response: GoogleLoginResponse): void => {
      // Show error maybe?
      console.log(response.profileObj.googleId);
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
                            onFailure={failureResponse}
                            render={props => (
                                <button {...props} style={{ background: 'none', border: 'none' }}>
                                    <img src={googlelogo} alt="google" />
                                </button>
                            )}
                            cookiePolicy='single_host_origin'
                        />
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