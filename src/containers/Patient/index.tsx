import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Box from '@material-ui/core/Box';

import { Layout } from '../../components/Layout/Layout';
import { AppButton } from '../../components/UI/AppButton';
import { PageLayout } from '../../components/UI/PageLayout';
import { UserModel } from '../../models/User';
import { changeCurrentUser } from '../../store/user/action';
import { UserData } from '../UserData';
import { BackButton } from '../../components/BackButton';

type MemberInfoParams = {
  id: string
}
type PatientProps = {}

export const Patient: React.FC<PatientProps> = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const id = useRouteMatch<MemberInfoParams>()?.params?.id;

  useLayoutEffect(() => {
    dispatch(changeCurrentUser(id));
  }, []);


  return (
    <Layout title="" BackButtonCustom={<BackButton text="Вернуться к пациентам" />}>
      <PageLayout>
        <Box pb={8}>
          <UserData />

          <AppButton
            floated
            disabled={!UserModel.getCurrentUserDataStatus()}
            onClick={() => history.push('/passport')}
            appColor="linear">
            Имунный паспорт
          </AppButton>
        </Box>
      </PageLayout>
    </Layout>
  );
};