import React, { useState, useEffect, FC } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';

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

import { useAccessToken } from './hooks/useAccessToken';

import { Secure } from './components';
import { MarkVaccine } from './containers/MarkVaccine';

type AppProps = {
  user: any

  userInit: Function
  appDataInit: Function
}

const appValidation = (tokenToCheck: string) => tokenToCheck.length > 0;
const loginValidation = (tokenToCheck: string) => tokenToCheck.length === 0;

type SecureProps = {
  children: JSX.Element,
}

const ApplicationSecure: FC<SecureProps> = (props) => (
  <Secure validation={appValidation} redirect="/">
    {props.children}
  </Secure>
);

const LoginnSecure: FC<SecureProps> = (props) => (
  <Secure validation={loginValidation} redirect="/profile">
    {props.children}
  </Secure>
);

const App: React.FC<AppProps> = function ({
  user,
  userInit,
  appDataInit
}) {
  const [isINIT, setIsINIT] = useState(false);
  const isAuth = Boolean(user);
  const { token } = useAccessToken();

  useEffect(() => {
    void async function () {
      await userInit();

      if (token.length > 0) {
        await appDataInit(token);
      }

      setIsINIT(true);
    }()
  }, [token]);

  if (!isINIT) return <div className="App">
    <SplashScreen />
  </div>;

  return (
    <div className="App">
      <Route render={({ location }) => (
        <TransitionGroup exit={false}>
          <CSSTransition timeout={150} classNames="page" key={location.key}>

            <Switch location={location}>

              {!isAuth && <Route path={`/reg`} exact>
                <ApplicationSecure>
                  <Reg />
                </ApplicationSecure>
              </Route>}

              <Route path={`/`} exact>
                <Secure validation={loginValidation} redirect="/profile">
                  <MeetingPage />
                </Secure>
              </Route>


              <Route path={`/login`} exact>
                <LoginnSecure>
                  <LoginPage />
                </LoginnSecure>
              </Route>


              <Route path={`/registration`} exact>
                <LoginnSecure>
                  <Registration />
                </LoginnSecure>
              </Route>

              {/* если пользователь не зарегистрировался, то ему доступен только роут reg - страница входа */}
              {!isAuth && <Redirect to={`/reg`} />}

              <Route path={`/profile`} exact>
                <ApplicationSecure>
                  <Profile />
                </ApplicationSecure>
              </Route>

              <Route path={`/calendar`} exact>
                <ApplicationSecure>
                  <Calendar />
                </ApplicationSecure>
              </Route>

              <Route path={`/passport`} exact>
                <ApplicationSecure>
                  <Passport />
                </ApplicationSecure>
              </Route>

              <Route path={`/vaccination`} exact>
                <ApplicationSecure>
                  <Vaccination />
                </ApplicationSecure>
              </Route>

              {/* двух шаговые роуты */}
              <Route path={`/take/:id`} exact>
                <ApplicationSecure>
                  <LastAppointment />
                </ApplicationSecure>
              </Route>

              <Route path={`/passport/take`} exact>
                <ApplicationSecure>
                  <ChooseClinic />
                </ApplicationSecure>
              </Route>

              <Route path={`/passport/:id`} exact>
                <ApplicationSecure>
                  <Diseas />
                </ApplicationSecure>
              </Route>

              <Route path={`/profile/add`} exact>
                <ApplicationSecure>
                  <AddMember />
                </ApplicationSecure>
              </Route>

              <Route path={`/profile/:id`} exact>
                <ApplicationSecure>
                  <Patient />
                </ApplicationSecure>
              </Route>

              <Route path={`/calendar/mark`} exact>
                <ApplicationSecure>
                  <MarkVaccine />
                </ApplicationSecure>
              </Route>

              <Route path={`/calendar/:id`} exact>
                <ApplicationSecure>
                  <LastAppointment />
                </ApplicationSecure>
              </Route>

              <Route path={`/vaccination/add`} exact>
                <ApplicationSecure>
                  <ReadyPage />
                </ApplicationSecure>
              </Route>

              {/* трёхуровневые роуты */}
              <Route path={`/passport/vaccine/:id`} exact>
                <ApplicationSecure>
                  <Vaccine />
                </ApplicationSecure>
              </Route>

              <Route path={`/passport/appointment/:id`} exact>
                <ApplicationSecure>
                  <Appointment />
                </ApplicationSecure>
              </Route>

              <Route path={`/profile/:id/quiz`} exact>
                <ApplicationSecure>
                  <Quiz />
                </ApplicationSecure>
              </Route>

              <Route path={`/profile/:id/profession`} exact>
                <ApplicationSecure>
                  <Profession />
                </ApplicationSecure>
              </Route>

              <Route path={`/profile/:id/region`} exact>
                <ApplicationSecure>
                  <Region />
                </ApplicationSecure>
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
