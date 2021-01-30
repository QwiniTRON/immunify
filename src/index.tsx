import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@material-ui/core/styles';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Provider } from 'react-redux';

import './styles/index.scss';

import { mainTheme } from './styles/Theme';
import { store } from "./store";
import { AppRouter } from './router';
import { AppAccessTokenProvider } from './hooks';


ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={mainTheme}>
      <AppRouter>
        <AppAccessTokenProvider>
          <App />
        </AppAccessTokenProvider>
      </AppRouter>
    </ThemeProvider>
  </Provider>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
reportWebVitals();
