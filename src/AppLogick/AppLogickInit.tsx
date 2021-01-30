import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAccessToken } from '../hooks';
import { appDataInit } from '../store/appData/action';
import { userInit } from '../store/user/action';


export function useAppInitLogick () {
  const dispatch = useDispatch();

  const [isINIT, setIsINIT] = useState(false);
  const { token } = useAccessToken();

  const appInit = () => {
    void async function () {
      await dispatch(userInit());

      if (token.length > 0) {
        await dispatch(appDataInit(token));
      }

      setIsINIT(true);
    }()
  };

  // инициализация приложения
  // при смене токена мы проверяем пользователя
  useEffect(appInit, [token]);

  return {isINIT};
}