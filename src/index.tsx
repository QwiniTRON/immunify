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


ReactDOM.render(
  <Provider store={store}>
    <AppRouter>
      <ThemeProvider theme={mainTheme}>
        <App />
      </ThemeProvider>
    </AppRouter>
  </Provider>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();
reportWebVitals();
