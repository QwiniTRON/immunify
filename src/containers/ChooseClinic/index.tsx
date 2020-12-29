import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import MapIcon from '@material-ui/icons/Map';

import { Layout } from '../../components/Layout/Layout';
import { InfoCard } from '../../components/UI/InfoCard';
import { AppTabPanel } from '../../components/UI/TabPanel';
import { PageLayout } from '../../components/UI/PageLayout';
import { BackButton } from '../../components/BackButton';
import { useLocation } from 'react-router-dom';
import { GetHospitals } from '../../server/fetchers/hospital';
import { useServer } from '../../hooks/useServer';
import { Loader } from '../../components';



type ChooseClinicProps = {}

type ChooseClinicRouteState = {
  type: 'vaccine' | 'diseas',
  data: any
}

const useStyles = makeStyles({
  content: {
    flexGrow: 1,
    overflow: 'auto',
    flexBasis: 1
  },
  root: {
    display: 'flex',
    flexDirection: 'column'
  }
});

type Clinic = { id: number, name: string }

export const ChooseClinic: React.FC<ChooseClinicProps> = (props) => {
  const clasess = useStyles();
  const routeData: ChooseClinicRouteState | undefined = useLocation<ChooseClinicRouteState>().state;

  const clinicsReq = useServer(GetHospitals);
  const loading = clinicsReq.state.fetching;
  const success = !loading && clinicsReq.state.answer.succeeded;

  const [tabValue, setTabValue] = useState(0);
  const [clinics, setClinics] = useState<Clinic[]>([]);

  useEffect(() => {
    clinicsReq.fetch(undefined);
  }, []);

  useEffect(() => {
    if (success) {
      setClinics(clinicsReq?.state?.answer?.data as Clinic[]);
      clinicsReq.reload();
    }
  }, [success]);

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };


  let takeTarget = '';
  if (routeData?.type == 'diseas') {
    takeTarget = `Запись на болезнь ${routeData.data.name}`;
  }
  if (routeData?.type == 'vaccine') {
    takeTarget = `Запись на вакцину ${routeData.data.name}`;
  }


  return (
    <Layout title="" clearScroll BackButtonCustom={<BackButton to={`/passport`} text="Вернуться к списку центров" />} >
      <PageLayout className={clasess.root}>

        <Box component="h2" fontSize={24} fontWeight={500}>
          {takeTarget}
        </Box>

        <Box component="h2" fontSize={18} fontWeight={500} marginY={1}>
          Выберите медцентр
        </Box>

        <Box mb={1}>
          <Tabs variant="fullWidth" indicatorColor="primary" value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
            <Tab label="Список" textColor="#000" />
            <Tab label="карта" textColor="#000" />
          </Tabs>
        </Box>

        <AppTabPanel value={tabValue} index={0} className={clasess.content} >
          <Box p={1}>

            {loading && <Box m={3}><Loader /></Box>}
            {!loading && clinics.map((c) => (
              <Box marginY={2}>
                <InfoCard data={[
                  { description: '', title: c.name }
                ]}
                  detailText="Детали"
                  to={`/passport/appointment/${c.id}`}
                />
              </Box>
            ))}

          </Box>
        </AppTabPanel>
        <AppTabPanel value={tabValue} index={1}>
          <Box textAlign="center">
            <MapIcon />
          </Box>
        </AppTabPanel>
      </PageLayout>
    </Layout>
  );
};