import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Provider } from 'react-redux';
import { OidcSecure, AuthenticationProvider, } from '@axa-fr/react-oidc-context';
import { SplashScreen } from './components/SplashScreen';

import './styles/index.scss';

import { mainTheme } from './styles/Theme';
import { store } from "./store";
import { ProductionConfig, DeveloperConfig } from './configuration';

export const appBaseName = process.env.NODE_ENV === 'production' ? "/app" : '';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={appBaseName}>
      <ThemeProvider theme={mainTheme}>
        <AuthenticationProvider 
          notAuthorized={SplashScreen}
          notAuthenticated={SplashScreen} 
          authenticating={SplashScreen}
          
          configuration={process.env.NODE_ENV === 'production' ? ProductionConfig : DeveloperConfig}
        >
          <OidcSecure>
            <App />
          </OidcSecure>
        </AuthenticationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
reportWebVitals();
