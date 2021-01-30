import React from 'react';

type AppAccessTokenContextState = {
  token: string
  set: Function
}

export const AppAccessTokenContext = React.createContext<AppAccessTokenContextState>({token: '', set: () => {}});