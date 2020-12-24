import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Provider } from 'react-redux';
import { OidcSecure, AuthenticationProvider, } from '@axa-fr/react-oidc-context';

import './styles/index.scss';

import { mainTheme } from './styles/Theme';
import {  store } from "./store";
import { config } from './configuration';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={mainTheme}>
          <AuthenticationProvider configuration={config}>
            <OidcSecure>
              <App />
            </OidcSecure>
          </AuthenticationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
reportWebVitals();
