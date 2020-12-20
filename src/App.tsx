import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';

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
import { RootState } from './store';
import { RegSuccess } from './containers/RegSuccess';
import { AddMember } from './containers/AddMember';
import { userInit } from './store/user/action';
import { SplashScreen } from './components/SplashScreen';
import { MemberInfo } from './containers/MemberInfo';
import { MainPage } from './containers/MainPage';
import { LoginPage } from './containers/LoginPage';


type AppProps = {
  user: any

  userInit: Function
}

const App: React.FC<AppProps> = function ({
  user,
  userInit
}) {
  const [isINIT, setIsINIT] = useState(false);
  const isAuth = Boolean(user);

  useEffect(() => {
    void async function () {
      const userInitReq = userInit();

      setTimeout(() => {
        setIsINIT(true);
      }, 1000);
    }()
  }, []);

  if (!isINIT) return <div className="App">
    <SplashScreen />
  </div>;

  return (
    <div className="App">
      <Route render={({ location }) => (
        <TransitionGroup exit={false}>
          <CSSTransition timeout={150} classNames="page" key={location.key}>

            <Switch location={location}>

              {!isAuth && <Route path="/reg" exact>
                <Reg />
              </Route>}

              {/* если пользователь не зарегистрировался, то ему доступен только роут reg - страница входа */}
              {!isAuth && <Redirect to="/reg" />}

              <Route path="/" exact>
                <Layout title="пока главная">
                  <MainPage />
                </Layout>
              </Route>

              {/* <Route path="/reg/success" exact>
                <RegSuccess />
              </Route> */}

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
                <Layout title="Иммунный пасспорт" titleCurrentName>
                  <Passport />
                </Layout>
              </Route>

              <Route path="/take" exact>
                <Layout title="Запись">
                  <Take />
                </Layout>
              </Route>

              {/* двух шаговые роуты */}
              {/* <Route path="/profile/family" exact>
                <Layout title="Данные семьи">
                  <Family />
                </Layout>
              </Route> */}

              {/* <Route path="/profile/data" exact>
                <Layout title="ваши данные">
                  <UserData />
                </Layout>
              </Route> */}

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
              <Route path="/profile/family/add" exact>
                <Layout title="Данные семьи">
                  <AddMember />
                </Layout>
              </Route>

              <Route path="/profile/family/:id" exact>
                <Layout title="Данные семьи">
                  <MemberInfo />
                </Layout>
              </Route>

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
          </CSSTransition>
        </TransitionGroup>)} />
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
  user: state.user.user
});
const mapDispatchToProps = {
  userInit
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
