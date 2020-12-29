import React, { useState, FC } from 'react';
import googlelogo from '../../assets/google.png';
import vklogo from '../../assets/vk.png';
import facebooklogo from '../../assets/facebook.png';
import { Link } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import { useServer } from '../../hooks/useServer';
import { useAccessToken } from '../../hooks/useAccessToken';

import {
  Login,
} from '../../server';

import './loginpage.scss';

type Form = {
  username: string,
  password: string,
}

export const LoginPage: FC = () => {
  const loginFetcher = useServer(Login);
  const { set: setToken } = useAccessToken();

  const { 
    register,
    handleSubmit,
    errors,
  } = useForm<Form>();

  const onSubmit = (data: Form) => {
    loginFetcher.fetch({
      username: data.username,
      password: data.password,
    })
  }

  const loading = loginFetcher.state.fetching;
  const success = !loading && loginFetcher.state.answer.succeeded;
  const error = !loading && (loginFetcher.state.answer.errorMessage || "");

  if (success) {
    setToken(loginFetcher.state.answer.data?.token || "");
    window.location.href = "/profile";
    loginFetcher.reload();
  }

  return (
    <div className="login-page">
      <div className="container">
        <h1 className="title">Вход</h1>

        <main>

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
                Нет аккаунта? <Link className="socials__link" to="/registration">Зарегистрироваться</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}