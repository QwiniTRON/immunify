import { useReducer } from 'react';

type State = {
  token: string,
}

function reducer(state: State, action: { payload: string }) {
  return { token: action.payload };
}

export const useAccessToken = () => {
  const [state, dispatch] = useReducer(reducer, { token: localStorage.getItem('token') || '' });

  const setToken = (token: string) => {
    localStorage.setItem('token', token);
    dispatch({ payload: token })
  } 

  return {
    token: state.token,
    set: setToken
  }
}
