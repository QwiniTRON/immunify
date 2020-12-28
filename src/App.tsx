import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';
import { useReactOidc, OidcSecure } from '@axa-fr/react-oidc-context';

import { userInit } from './store/user/action';
import { appDataInit } from './store/appData/action';
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
import { LastAppointment } from './containers/LastAppointment';
import { Registration } from './containers/Registration';
import { MeetingPage } from './containers/MeetingPage';


type AppProps = {
  user: any

  userInit: Function
  appDataInit: Function
}

const App: React.FC<AppProps> = function ({
  user,
  userInit,
  appDataInit
}) {
  const [isINIT, setIsINIT] = useState(false);
  const { oidcUser } = useReactOidc();
  const isAuth = Boolean(user);

  useEffect(() => {
    void async function () {
      if (oidcUser !== null) {
        const userReq = await userInit();
        const appDataReq = await appDataInit(oidcUser.access_token!);
        setIsINIT(true);
      }
    }()
  }, [oidcUser]);

  if (!isINIT) return <div className="App">
    <SplashScreen />
  </div>;

  return (
    <div className="App">
      <Route render={({ location }) => (
        <TransitionGroup exit={false}>
          <CSSTransition timeout={150} classNames="page" key={location.key}>

            <Switch location={location}>

              {!isAuth && <Route path={`/`} exact>
                <OidcSecure><MeetingPage /></OidcSecure>
              </Route>}
              {!isAuth && <Route path={`/reg`} exact>
                <OidcSecure><Reg /></OidcSecure>
              </Route>}
              {!isAuth && <Route path={`/login`} exact>
                <OidcSecure><LoginPage /></OidcSecure>
              </Route>}
              {!isAuth && <Route path={`/registration`} exact>
                <OidcSecure><Registration /></OidcSecure>
              </Route>}

              {/* если пользователь не зарегистрировался, то ему доступен только роут reg - страница входа */}
              {!isAuth && <Redirect to={`/reg`} />}

              <Route path={`/profile`} exact>
                <OidcSecure>
                  <Profile />
                </OidcSecure>
              </Route>

              <Route path={`/calendar`} exact>
                <OidcSecure>
                  <Calendar />
                </OidcSecure>
              </Route>

              <Route path={`/passport`} exact>
                <OidcSecure>
                  <Passport />
                </OidcSecure>
              </Route>

              <Route path={`/vaccination`} exact>
                <OidcSecure>
                  <Vaccination />
                </OidcSecure>
              </Route>

              {/* двух шаговые роуты */}
              <Route path={`/take/:id`} exact>
                <OidcSecure>
                  <LastAppointment />
                </OidcSecure>
              </Route>

              <Route path={`/passport/take`} exact>
                <OidcSecure>
                  <ChooseClinic />
                </OidcSecure>
              </Route>

              <Route path={`/passport/:id`} exact>
                <OidcSecure>
                  <Diseas />
                </OidcSecure>
              </Route>

              <Route path={`/profile/add`} exact>
                <OidcSecure>
                  <AddMember />
                </OidcSecure>
              </Route>

              <Route path={`/profile/:id`} exact>
                <OidcSecure>
                  <Patient />
                </OidcSecure>
              </Route>

              <Route path={`/calendar/:id`} exact>
                <OidcSecure>
                  <LastAppointment />
                </OidcSecure>
              </Route>

              <Route path={`/vaccination/add`} exact>
                <OidcSecure>
                  <ReadyPage />
                </OidcSecure>
              </Route>

              {/* трёхуровневые роуты */}
              <Route path={`/passport/vaccine/:id`} exact>
                <OidcSecure>
                  <Vaccine />
                </OidcSecure>
              </Route>

              <Route path={`/passport/appointment/:id`} exact>
                <OidcSecure>
                  <Appointment />
                </OidcSecure>
              </Route>

              <Route path={`/profile/:id/quiz`} exact>
                <OidcSecure>
                  <Quiz />
                </OidcSecure>
              </Route>

              <Route path={`/profile/:id/profession`} exact>
                <OidcSecure>
                  <Profession />
                </OidcSecure>
              </Route>

              <Route path={`/profile/:id/region`} exact>
                <OidcSecure>
                  <Region />
                </OidcSecure>
              </Route>

              <Redirect to={`/profile`} />

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
  userInit,
  appDataInit
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
