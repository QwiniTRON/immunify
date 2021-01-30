import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useSelector } from 'react-redux';

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

import { MarkVaccine } from './containers/MarkVaccine';
import { VaccinationDetails } from './containers/VaccinationDetails';
import { ErrorBounder } from './components/ErrorBounder';
import { A2hsBunner } from './components/UI/A2hsBunner';
import { useA2hsLogick, useAppInitLogick, useAppLogick, ApplicationSecure, LoginnSecure } from './AppLogick';
import { AppRoutes } from './router';


type AppProps = {
}

/**
 * APP
 * 
 */
const App: React.FC<AppProps> = function (props) {
  const { isINIT } = useAppInitLogick();
  const { a2hsAgree, a2hsBunner, a2hsCancel, seta2hsBunner } = useA2hsLogick();
  useAppLogick();

  const user = useSelector((state: RootState) => state.user.user);
  const isUserData = Boolean(user);

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
          <TransitionGroup exit={false} >
            <CSSTransition timeout={150} classNames="page" key={location.key}>

              <AppRoutes isUserData={isUserData} location={location} />

            </CSSTransition>
          </TransitionGroup>)} />
      </div>
    </ErrorBounder>
  );
}

export default App;