import React, { useState, useEffect, FC, useRef } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { connect } from 'react-redux';

import { userInit } from './store/user/action';
import { appDataInit } from './store/appData/action';
import { Reg } from './containers/Reg/Reg';
import { Calendar } from './containers/Calendar';
import { Profile } from './containers/Profile';
import { Passport } from './containers/Passport';
import { Region } from './containers/Region';
import { Profession } from './containers/Profession';
import { Quiz } from './containers/Quiz';
import { Diseas } from './containers/Diseas';
import { ReadyPage } from './containers/ReadyPage';
import { RootState } from './store';
import { AddMember } from './containers/AddMember';
import { SplashScreen } from './components/SplashScreen';
import { LoginPage } from './containers/LoginPage';
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
import { VaccinationDetails } from './containers/VaccinationDetails';
import { ErrorBounder } from './components/ErrorBounder';
import { A2hsBunner } from './components/UI/A2hsBunner';


// todo
// заполнить todo


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


/**
 * APP
 * 
 */
const App: React.FC<AppProps> = function ({
  user,
  userInit,
  appDataInit
}) {
  const [isINIT, setIsINIT] = useState(false);
  const isAuth = Boolean(user);
  const { token } = useAccessToken();

  // a2hs banner
  const [a2hsBunner, seta2hsBunner] = useState(false);
  const a2hsPrompt = useRef<Event | null>();


  // инициализация приложения
  useEffect(() => {
    void async function () {
      await userInit();

      if (token.length > 0) {
        await appDataInit(token);
      }

      setIsINIT(true);
    }()
  }, [token]);


  // height fix
  useEffect(() => {
    const vh = window.innerHeight / 100;
    document.documentElement.style.setProperty('--vh', String(vh));
    document.documentElement.style.setProperty('--full_height', `${window.innerHeight}px`);

    const resizeObserver = new (window as any).ResizeObserver((entries: any) => {
      const [htmlMetrics] = entries;

      const vh = htmlMetrics.contentRect.height / 100;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });

    resizeObserver.observe(window.document.documentElement);
  }, []);

  // отлов a2hs
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();

      if(!Boolean(a2hsPrompt.current)) seta2hsBunner(true);
      
      a2hsPrompt.current = e;
    });


    console.log("%c Immunify", "font-size: 36px;font-family: 'Courier New', Courier, monospace;font-weight: bold;color: #9BC83F;background-color: #fff;padding: 5px 20px;");
    console.log("%c Рады помочь", "font-size: 18px;font-family: 'Courier New', Courier, monospace;font-weight: bold;color: #fff;background-color: #9BC83F;padding: 5px 20px;");
  }, []);

  // согласие на добавление
  const a2hsAgree = () => {
    (a2hsPrompt.current as any).prompt();

    seta2hsBunner(false);

    (a2hsPrompt.current as any).userChoice.then((choiceResult: any) => {
      // a2hsPrompt.current = null;
    });
  }

  // отмена
  const a2hsCancel = () => {
    seta2hsBunner(false);
  }

  // режим загрузки
  if (!isINIT) return <div className="App">
    <SplashScreen />
  </div>;

  return (
    <ErrorBounder placeholder={<div>Произошла ошибка перезагрузите приложение</div>} >

      <CSSTransition unmountOnExit mountOnEnter in={a2hsBunner} timeout={300} classNames="fade" >
        <A2hsBunner onAgree={a2hsAgree} onCancel={a2hsCancel} onClose={() => seta2hsBunner(false)} />
      </CSSTransition>

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

                <Route path={`/vaccination/:id`} exact>
                  <ApplicationSecure>
                    <VaccinationDetails />
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
    </ErrorBounder>
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