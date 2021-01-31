import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useServer } from '.';
import { UserModel } from '../models/User';
import { GetPersonality } from '../server';
import { setUser, changeUserLoading } from '../store/user/action';
import { encodeUserPersonality } from '../utils';



export function useGetPersonality(): [Function, boolean, boolean] {
  const dispatch = useDispatch();
  const getPersonalityReq = useServer(GetPersonality);
  const success = !getPersonalityReq.state.fetching && getPersonalityReq.state.answer.succeeded;
  const failure = !getPersonalityReq.state.fetching && !getPersonalityReq.state.answer.succeeded && getPersonalityReq.isFetched;
  const loading = getPersonalityReq.state.fetching as boolean;
  const [isLoaded, setIsLoaded] = useState(false);

  // отмена статуса загрузки 
  useEffect(() => {
    return () => {
      getPersonalityReq.cancel();
      dispatch(changeUserLoading(false));
    }
  }, []);

  // успешный ответ
  if (success) {
    dispatch(changeUserLoading(false));
    setIsLoaded(true);

    const userPersonalityHashed = getPersonalityReq.state.answer.data;
    const userPersonality = encodeUserPersonality(userPersonalityHashed || '');

    try {
      const userData = JSON.parse(userPersonality);

      dispatch(setUser(userData));
      UserModel.saveUser(userData);
    } catch (err) { }


    getPersonalityReq.reload();
  }

  // не успешный ответ
  if (failure) {
    dispatch(changeUserLoading(false));
    setIsLoaded(true);

    getPersonalityReq.reload();
  }

  // сделать запрос данных пользователя
  function fetch() {
    dispatch(changeUserLoading(true));

    getPersonalityReq.fetch({});
  }

  return [fetch, loading, isLoaded];
}