import React from 'react';

import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';
import { UserData } from '../UserData';

type PatientProps = {}

export const Patient: React.FC<PatientProps> = (props) => {
  return (
    <Layout titleCurrentName title="данные пациента">
      <PageLayout>
          <UserData />
      </PageLayout>
    </Layout>
  );
};