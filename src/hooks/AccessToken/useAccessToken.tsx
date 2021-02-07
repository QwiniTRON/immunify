import React, { useReducer, useContext } from 'react';

import {AppAccessTokenContext} from './AccessTokenContext';

type State = {
  token: string
};


function reducer(state: State, action: { payload: string }) {
  return { token: action.payload };
}


type AccessTokenProviderProps = {}

export const AppAccessTokenProvider: React.FC<AccessTokenProviderProps> = (props) => {
  const [state, dispatch] = useReducer(reducer, { token: localStorage.getItem('token') || '' });

  const setToken = (token: string) => {
    localStorage.setItem('token', token);
    dispatch({ payload: token });
  };

  const context = {
    token: state.token,
    set: setToken
  };

  return (
    <AppAccessTokenContext.Provider value={context}>
      {props.children}
    </AppAccessTokenContext.Provider>
  );
}

export const useAccessToken = () => {
  return useContext(AppAccessTokenContext);
}