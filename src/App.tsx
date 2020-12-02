import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Layout } from './components/Layout/Layout';
import { Reg } from './containers/Reg/Reg';
import { Calendar } from './containers/Calendar';
import { Profile } from './containers/Profile';
import { Take } from './containers/Take';
import { Passport } from './containers/Passport';
import { Family } from './containers/Family';
import { UserData } from './containers/UserData';
import { Region } from './containers/Region';
import { Profession } from './containers/Profession';
import { Quiz } from './containers/Quiz';
import { Diseas } from './containers/Diseas';
import { ReadyPage } from './containers/ReadyPage/inedex';

function App() {
  return (
    <div className="App">
      <Switch>

        <Route path="/" exact>
          <Layout title="пока главная">
            main immunify
          </Layout>
        </Route>

        <Route path="/calendar" exact>
          <Layout title="Календарь">
            <Calendar />
          </Layout>
        </Route>

        <Route path="/profile" exact>
          <Layout title="Профиль">
            <Profile />
          </Layout>
        </Route>

        <Route path="/passport" exact>
          <Layout title="Иммунный пасспорт">
            <Passport />
          </Layout>
        </Route>

        <Route path="/take" exact>
          <Layout title="Запись">
            <Take />
          </Layout>
        </Route>

        <Route path="/reg" exact>
          <Reg />
        </Route>

        {/* двух шаговые роуты */}
        <Route path="/profile/family" exact>
          <Layout title="Данные семьи">
            <Family />
          </Layout>
        </Route>

        <Route path="/profile/data" exact>
          <Layout title="ваши данные">
            <UserData />
          </Layout>
        </Route>
        
        <Route path="/passport/ready" exact>
          <Layout title="Прошедшие вакцинации">
            <ReadyPage />
          </Layout>
        </Route>
        
        <Route path="/passport/:id" exact>
          <Layout title="Болезнь">
            <Diseas />
          </Layout>
        </Route>

        {/* трёх уровневые роуты */}
        <Route path="/profile/data/quiz" exact>
          <Layout title="опросник">
            <Quiz />
          </Layout>
        </Route>

        <Route path="/profile/data/profession" exact>
          <Layout title="выбор профессии">
            <Profession />
          </Layout>
        </Route>

        <Route path="/profile/data/region" exact>
          <Layout title="выбор регоина">
            <Region />
          </Layout>
        </Route>

        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
