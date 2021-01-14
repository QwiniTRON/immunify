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
import { GetHospitals, HospitalResponse } from '../../server';
import { useServer } from '../../hooks/useServer';
import { Divider, Loader } from '../../components';

import { YMaps, Map, Placemark } from 'react-yandex-maps';

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
    flexDirection: 'column',
    padding: '10px 20px'
  }
});

export const ChooseClinic: React.FC<ChooseClinicProps> = (props) => {
  const clasess = useStyles();
  const routeData: ChooseClinicRouteState | undefined = useLocation<ChooseClinicRouteState>().state;

  const clinicsReq = useServer(GetHospitals);
  const loading = clinicsReq.state.fetching;
  const success = !loading && clinicsReq.state.answer.succeeded;

  const [tabValue, setTabValue] = useState(0);
  const [clinics, setClinics] = useState<HospitalResponse>([]);

  useEffect(() => {
    clinicsReq.fetch(undefined);
  }, []);

  useEffect(() => {
    if (success) {
      setClinics(clinicsReq.state.answer.data! as HospitalResponse);
      clinicsReq.reload();
    }
  }, [success]);

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };


  // let takeTarget = '';
  // if (routeData?.type == 'diseas') {
  //   takeTarget = `Запись на болезнь ${routeData.data.name}`;
  // }
  // if (routeData?.type == 'vaccine') {
  //   takeTarget = `Запись на вакцину ${routeData.data.name}`;
  // }


  return (
    <Layout title="" clearScroll BackButtonCustom={<BackButton simpleBack routeText />} >
      <PageLayout className={clasess.root}>

        <Box component="h2" fontSize={24} fontWeight={500} marginY={1}>
          Выберите медцентр
        </Box>

        <Divider />

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
                  { description: 'Москва, улица Перерва, дом 53', title: c.name }
                ]}
                  detailText="Позвонить и записаться"
                  to={`/passport/appointment/${c.id}`}
                />
              </Box>
            ))}

          </Box>
        </AppTabPanel>
        <AppTabPanel value={tabValue} index={1}>
          <Box textAlign="center">
            <YMaps>
              <Map defaultState={{ center: [55.75, 37.57], zoom: 9 }}>
                {clinics.filter(x => x.latitude !== "" && x.longitude !== "").map((cl, index) => (
                  <Placemark key={index} geometry={[Number.parseFloat(cl.longitude), Number.parseFloat(cl.latitude)]} onClick={() => console.log('click')} />
                ))}
              </Map>
            </YMaps>
          </Box>
        </AppTabPanel>
      </PageLayout>
    </Layout>
  );
};