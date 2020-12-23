import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { Layout } from '../../components/Layout/Layout';
import { InfoCard } from '../../components/UI/InfoCard';
import { AppTabPanel } from '../../components/UI/TabPanel';
import { PageLayout } from '../../components/UI/PageLayout';


type ChooseClinicProps = {}

export const ChooseClinic: React.FC<ChooseClinicProps> = (props) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  return (
    <Layout title="">
      <PageLayout>

        <Box mb={1}>
          <Tabs variant="fullWidth" indicatorColor="primary" value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
            <Tab label="Календарь" textColor="#000" />
            <Tab label="Список" textColor="#000" />
          </Tabs>
        </Box>

        <AppTabPanel value={tabValue} index={0}>
          Item One
                </AppTabPanel>
        <AppTabPanel value={tabValue} index={1}>
          <Box marginY={1}>
            <InfoCard data={[
              { description: '11:00', title: '30 октября 2020' },
              { description: 'Москва, улица Перерва, дом 53', title: 'Клинико-диагностический центр МЕДСИ (Марьино)' },
              { description: 'Инфарникс', title: 'Вакцина' },
            ]}
              detailText="Детали"
              to=""
            />
          </Box>
          <Box marginY={1}>
            <InfoCard data={[
              { description: '11:00', title: '30 октября 2020' },
              { description: 'Москва, улица Перерва, дом 53', title: 'Клинико-диагностический центр МЕДСИ (Марьино)' },
              { description: 'Инфарникс', title: 'Вакцина' },
            ]}
              detailText="Детали"
              to=""
            />
          </Box>
          <Box marginY={1}>
            <InfoCard data={[
              { description: '11:00', title: '30 октября 2020' },
              { description: 'Москва, улица Перерва, дом 53', title: 'Клинико-диагностический центр МЕДСИ (Марьино)' },
              { description: 'Инфарникс', title: 'Вакцина' },
            ]}
              detailText="Детали"
              to=""
            />
          </Box>
        </AppTabPanel>
      </PageLayout>
    </Layout>
  );
};