import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAccessToken, useGetPersonality } from '../hooks';
import { UserModel } from '../models/';
import { appDataInit } from '../store/appData/action';
import { userInit } from '../store/user/action';


export function useAppInitLogick() {
  const dispatch = useDispatch();

  const [isINIT, setIsINIT] = useState(false);
  const { token } = useAccessToken();

  const [getPersonality, loadingPersonality, isGetPersonalityFetched] = useGetPersonality();

  const appInit = () => {
    void async function () {
      await dispatch(userInit());

      if (token.length > 0) {
        await dispatch(appDataInit(token));
      }

      if (token.length > 0 && !isGetPersonalityFetched) {
        const userData = UserModel.MainUser;
        if (!userData) {
          getPersonality();
        }
      }

      setIsINIT(true);
    }()
  };

  // инициализация приложения
  // при смене токена мы проверяем пользователя
  useEffect(appInit, [token]);

  return { isINIT };
}