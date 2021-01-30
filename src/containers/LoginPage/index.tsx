import React, { FC, useEffect } from 'react';
import googlelogo from '../../assets/google.png';
import vklogo from '../../assets/vk.png';
import facebooklogo from '../../assets/facebook.png';
import { Link, useHistory } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import { useServer } from '../../hooks/useServer';

import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import VkLogin from 'react-vkontakte-login';

import {
  Login,
  ExternalLogin,
  ExternalAuth,
} from '../../server';

import './loginpage.scss';
import { UserModel } from '../../models/User';
import { useAccessToken } from '../../hooks';

type Form = {
  username: string,
  password: string,
}

export const LoginPage: FC = () => {
  const history = useHistory();
  const loginFetcher = useServer(Login);
  const externalLoginFetcher = useServer(ExternalLogin);
  const { set: setToken } = useAccessToken();

  const {
    register,
    handleSubmit,
    errors,
    getValues
  } = useForm<Form>();

  const onSubmit = (data: Form) => {
    loginFetcher.fetch({
      username: data.username,
      password: data.password,
    })
  }

  const loading = loginFetcher.state.fetching || externalLoginFetcher.state.fetching;
  const successLogin = !loading && loginFetcher.state.answer.succeeded;
  const successExternal = !loading && externalLoginFetcher.state.answer.succeeded;

  const error = !loading && (loginFetcher.state.answer.errorMessage || externalLoginFetcher.state.answer.errorMessage || "");
  

  if (successLogin) {
    UserModel.CurrentUserEmail = getValues().username;
    UserModel.chekUserEmail();
    
    setToken(loginFetcher.state.answer.data?.token || "");

    loginFetcher.reload();
  }

  if (successExternal) {
    UserModel.chekUserEmail();

    setToken(externalLoginFetcher.state.answer.data?.token || "");

    externalLoginFetcher.reload();
  }

  const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline): void => {

    function isGoogleResponse(obj: any): obj is GoogleLoginResponse {
      return obj.profileObj !== undefined;
    }

    if (isGoogleResponse(response)) {
      UserModel.CurrentUserEmail = response.profileObj.email;

      externalLoginFetcher.fetch({
        externalAuth: ExternalAuth.Google,
        identity: response.googleId,
      });
    }
  }

  const failureResponseGoogle = (response: GoogleLoginResponse): void => {
    // Show error maybe?
    console.log(response.profileObj.googleId);
  }

  const facebookCallback = (userInfo: any): void => {
    if (userInfo.userID !== undefined) {
      UserModel.CurrentUserEmail = userInfo.email;

      externalLoginFetcher.fetch({
        externalAuth: ExternalAuth.Facebook,
        identity: userInfo.userID,
      });
    }
  }

  const vkCallback = (userInfo: any): void => {
    if (userInfo.session !== undefined) {
      UserModel.CurrentUserEmail = userInfo.session.user.email;

      externalLoginFetcher.fetch({
        externalAuth: ExternalAuth.VK,
        identity: userInfo.session.user.id,
      });
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <h1 className="title">Вход</h1>

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
              <p className="input-group__title">Имя пользователя</p>
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


          <div className="login__buttons">
            <button className="button button--app" disabled={loading} type="submit">войти</button>
          </div>
        </form>


        <div className="socials">
          <div className="socials__title">вход через соцсети</div>

          <div className="socials__networks">
            <div className="socials__item">
              <GoogleLogin
                clientId="830770546293-pu13vb9rsqgbh1u4oklhg47p3humh3gr.apps.googleusercontent.com"
                buttonText="Login"
                onSuccess={responseGoogle}
                onFailure={failureResponseGoogle}
                render={props => (
                  <button type="button" {...props} style={{ background: 'none', border: 'none' }}>
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
                  <button {...renderProps} type="button" style={{ background: 'none', border: 'none' }}>
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
                  <button onClick={renderProps.onClick} type="button" style={{ background: 'none', border: 'none' }}>
                    <img src={facebooklogo} alt="facebook" />
                  </button>
                )}
              />
            </div>
          </div>

          <div className="socials__notice">
            Нет аккаунта? <Link className="socials__link" to="/registration">Зарегистрироваться</Link>
          </div>
        </div>
      </div>
    </div>
  );
}