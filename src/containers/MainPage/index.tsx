import React, { useState } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { AppDatePicker } from '../../components/UI/appDatePicker';

import { PageLayout } from '../../components/UI/PageLayout';

type MainPageProps = {}

export const MainPage: React.FC<MainPageProps> = (props) => {
  const [age, setAge] = useState(0);
console.log(age);

  return (
    <Layout title="Главная">
      <PageLayout>
        main page

        <AppDatePicker changeHandle={(value) => setAge(value)} value={age} />
      </PageLayout>
    </Layout>
  );
};