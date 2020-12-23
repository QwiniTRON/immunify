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
import { ReadyPage } from './containers/ReadyPage';
import { RootState } from './store';
import { RegSuccess } from './containers/RegSuccess';
import { AddMember } from './containers/AddMember';
import { userInit } from './store/user/action';
import { SplashScreen } from './components/SplashScreen';
import { MemberInfo } from './containers/MemberInfo';
import { MainPage } from './containers/MainPage';
import { LoginPage } from './containers/LoginPage';
import { BackButton } from './components/BackButton';
import { Patient } from './containers/Patient';
import { Vaccine } from './containers/Vaccine';
import { ChooseClinic } from './containers/ChooseClinic';
import { Vaccination } from './containers/Vaccination';
import { Appointment } from './containers/Appointment';


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

              <Route path="/profile" exact>
                <Profile />
              </Route>

              <Route path="/test" exact>
                <ChooseClinic />
              </Route>

              <Route path="/calendar" exact>
                <Calendar />
              </Route>

              <Route path="/passport" exact>
                <Passport />
              </Route>

              <Route path="/take" exact>
                <Take />
              </Route>


              {/* двух шаговые роуты */}
              <Route path="/passport/ready" exact>
                <ReadyPage />
              </Route>

              <Route path="/passport/:id" exact>
                <Diseas />
              </Route>

              <Route path="/profile/add" exact>
                <AddMember />
              </Route>

              <Route path="/profile/:id" exact>
                <Patient />
              </Route>


              {/* трёхуровневые роуты */}
              <Route path="/profile/:id/quiz" exact>
                <Quiz />
              </Route>

              <Route path="/profile/:id/profession" exact>
                <Profession />
              </Route>

              <Route path="/profile/:id/region" exact>
                <Region />
              </Route>


              <Redirect to="/profile" />

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
