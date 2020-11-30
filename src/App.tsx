import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Layout } from './components/Layout/Layout';
import { Reg } from './containers/Reg/Reg';

function App() {
  return (
    <div className="App">
      <Switch>

        <Route path="/" exact>
          <Layout title="пока главная">
            main immunify
          </Layout>
        </Route>

        <Route path="/reg" exact>
          <Reg />
        </Route>

        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
