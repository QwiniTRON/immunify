import React from 'react';
import { Layout } from '../../components/Layout/Layout';
import { AppDatePicker } from '../../components/UI/appDatePicker';

import { PageLayout } from '../../components/UI/PageLayout';

type MainPageProps = {}

export const MainPage: React.FC<MainPageProps> = (props) => {
  return (
    <Layout title="Главная">
      <PageLayout>
        main page

        <AppDatePicker changeHandle={() => {}} value={0} />
      </PageLayout>
    </Layout>
  );
};