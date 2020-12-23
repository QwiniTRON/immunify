import React, { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';
import { changeCurrentUser } from '../../store/user/action';
import { UserData } from '../UserData';

type MemberInfoParams = {
  id: string
}
type PatientProps = {}

export const Patient: React.FC<PatientProps> = (props) => {
  const dispatch = useDispatch();
  const id = useRouteMatch<MemberInfoParams>()?.params?.id;

  useLayoutEffect(() => {
    dispatch(changeCurrentUser(id));
  }, []);

  return (
    <Layout titleCurrentName title="данные пациента">
      <PageLayout>
          <UserData />
      </PageLayout>
    </Layout>
  );
};