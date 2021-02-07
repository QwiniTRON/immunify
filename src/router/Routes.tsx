import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { ApplicationSecure, LoginnSecure } from '../AppLogick';
import { Reg } from '../containers/Reg/Reg';
import { MeetingPage } from '../containers/MeetingPage';
import { LoginPage } from '../containers/LoginPage';
import { Registration } from '../containers/Registration';
import { Profile } from '../containers/Profile';
import { Calendar } from '../containers/Calendar';
import { Passport } from '../containers/Passport';
import { Vaccination } from '../containers/Vaccination';
import { LastAppointment } from '../containers/LastAppointment';
import { ChooseClinic } from '../containers/ChooseClinic';
import { Diseas } from '../containers/Diseas';
import { AddMember } from '../containers/AddMember';
import { Patient } from '../containers/Patient';
import { MarkVaccine } from '../containers/MarkVaccine';
import { ReadyPage } from '../containers/ReadyPage';
import { VaccinationDetails } from '../containers/VaccinationDetails';
import { Vaccine } from '../containers/Vaccine';
import { Appointment } from '../containers/Appointment';
import { Quiz } from '../containers/Quiz';
import { Profession } from '../containers/Profession';
import { Region } from '../containers/Region';

type AppRoutesProps = {
  isUserData: boolean
  location: any
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ isUserData, location }) =>
(
  <>
    <Switch location={location as any}>

      {!isUserData && <Route path={`/reg`} exact>
        <ApplicationSecure>
          <Reg />
        </ApplicationSecure>
      </Route>}

      <Route path={`/`} exact>
        <LoginnSecure>
          <MeetingPage />
        </LoginnSecure>
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
      {!isUserData && <Redirect to={`/reg`} />}

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
  </>
)