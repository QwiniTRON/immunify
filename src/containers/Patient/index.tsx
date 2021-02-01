import React, { useEffect, useLayoutEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Box from '@material-ui/core/Box';

import "./patient.scss";

import { Layout } from '../../components/Layout/Layout';
import { AppButton } from '../../components/UI/AppButton';
import { PageLayout } from '../../components/UI/PageLayout';
import { UserModel } from '../../models/User/User';
import { changeCurrentUser } from '../../store/user/action';
import { UserData } from '../UserData';
import { BackButton } from '../../components/BackButton';
import { useServer } from '../../hooks/useServer';
import { GetQuestionnaire } from '../../server';
import { RootState } from '../../store';
import { setData } from '../../store/appData/action';
import { getYearOffsetNow } from '../../utils';


type MemberInfoParams = {
  id: string
}
type PatientProps = {}

export const Patient: React.FC<PatientProps> = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const store = useStore();

  const id = useRouteMatch<MemberInfoParams>()?.params?.id;
  const appDataRequest = useServer(GetQuestionnaire);
  const loading = appDataRequest.state.fetching;
  const success = !loading && appDataRequest.state.answer.succeeded;

  useLayoutEffect(() => {
    void async function () {

      await dispatch(changeCurrentUser(id));

      const currentState: RootState = store.getState();
      const currentUser = currentState.user.currentUser;
      const currentUserAge = getYearOffsetNow(Number(currentUser?.age));
      const currentUserMale = currentUser?.sex == 'man' ? 'М' : 'Ж';

      appDataRequest.fetch({ age: currentUserAge, male: currentUserMale });
    }();
  }, []);

  useEffect(() => {
    if (success) {
      const data = appDataRequest.state.answer.data;

      dispatch(setData(data as object));

      appDataRequest.reload();
    }
  }, [success]);


  return (
    <Layout title="" BackButtonCustom={<BackButton text="Вернуться к пациентам" />} background>
      <PageLayout className="patient-page">
        <Box pb={8} p="15px">
          <UserData />

          <div className="patient-page__pasport">
            <AppButton
              disabled={!UserModel.getCurrentUserDataStatus()}
              onClick={() => history.push(`/passport`)}
              appColor="linear">
              иммунный паспорт
          </AppButton>
          </div>
        </Box>
      </PageLayout>
    </Layout>
  );
};