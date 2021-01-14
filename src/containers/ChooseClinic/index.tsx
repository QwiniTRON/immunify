import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import { Layout } from '../../components/Layout/Layout';
import { InfoCard } from '../../components/UI/InfoCard';
import { AppTabPanel } from '../../components/UI/TabPanel';
import { PageLayout } from '../../components/UI/PageLayout';
import { BackButton } from '../../components/BackButton';
import { Link, useLocation } from 'react-router-dom';
import { GetHospitals, Clinic } from '../../server/fetchers/hospital';
import { useServer } from '../../hooks/useServer';
import { Divider, Loader } from '../../components';
import { sif } from '../../utils';

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
    padding: '10px 20px 0'
  },

  mapTab: {
    display: 'grid',
    gridTemplateRows: '100%',
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden'
  },

  subMenu: {
    position: 'absolute',
    bottom: 0,
    zIndex: 5,
    left: 0,
    right: 0,
    minHeight: 160,
    backgroundColor: 'white',
    borderRadius: '45px 45px 0 0',
    padding: '20px 20px 55px 20px',
    borderTop: '3px solid #9BC83F',
    transform: 'translateY(70%)',
    transition: 'transform 0.1s ease'
  },

  subMenuCloser: {
    height: 5,
    backgroundColor: '#777',
    borderRadius: 5,
    cursor: 'pointer',
    width: 50,
    margin: '0 auto 10px',
  },

  subMenu__open: {
    transition: 'transform 0.3s ease',
    transform: 'translateY(0%)'
  },

  takeLink: {
    fontSize: 18,
    fontWeight: 300,
    color: '#000',
    textDecoration: 'none',
    position: 'absolute',
    right: 15,
    bottom: 15
  },

  takeLinkIcon: {
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: '43px',
    borderRadius: 15,
    backgroundColor: '#9BC83F',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: 10,

    '& svg': {
      color: '#fff'
    }
  }
});

export const ChooseClinic: React.FC<ChooseClinicProps> = (props) => {
  const classes = useStyles();
  const routeData: ChooseClinicRouteState | undefined = useLocation<ChooseClinicRouteState>().state;

  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const clinicsReq = useServer(GetHospitals);
  const loading = clinicsReq.state.fetching;
  const success = !loading && clinicsReq.state.answer.succeeded;

  const [tabValue, setTabValue] = useState(0);

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinic, setClinic] = useState<Clinic | null>(null);

  useEffect(() => {
    clinicsReq.fetch(undefined);
  }, []);

  useEffect(() => {
    if (success) {

      // __MOCK__
      let clinics = (clinicsReq?.state?.answer?.data as Clinic[]).map((clinic) => {
        clinic.latitude = String(55.25 + Math.random() * 1);
        clinic.longitude = String(37.57 + Math.random() * 1);

        return clinic;
      });
      // __MOCK__
      
      setClinics(clinics as Clinic[]);
      clinicsReq.reload();
    }
  }, [success]);


  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  // точки клиник на карте
  let clinicToShow = clinics.map((clinic) => {
    const x = global.parseFloat(clinic.latitude);
    const y = global.parseFloat(clinic.longitude);

    return (
      <Placemark key={clinic.id} geometry={[x, y]} onClick={() => (setClinic(clinic), setSubMenuOpen(true))} />
    );
  });


  let subMenuContent: JSX.Element | null = null;
  if (!clinic) {
    subMenuContent = (<Box fontSize={18} fontWeight={500}>
      клиника не выбрана
    </Box>);
  }

  if (clinic) {
    subMenuContent = (
      <>
        <Box fontSize={18} fontWeight={500}>
          {clinic.name}
        </Box>
        <Box fontSize={18} fontWeight={300}>
          Москва, улица Перерва, дом 53
        </Box>

        <Link to={`/passport/appointment/${clinic.id}`} className={classes.takeLink}>Позвонить и записаться
          <div className={classes.takeLinkIcon}><ArrowForwardIosIcon /></div>
        </Link>
      </>
    );
  }


  return (
    <Layout title="" clearScroll BackButtonCustom={<BackButton simpleBack routeText />} >
      <PageLayout className={classes.root}>

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

        <AppTabPanel value={tabValue} index={0} className={classes.content} >
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

        <AppTabPanel className={classes.mapTab} value={tabValue} index={1}>


          {loading && <Box m={3}><Loader /></Box>}

          {!loading &&
            <>
              <YMaps>
                <Map width="100%" height="initial" defaultState={{ center: [55.75, 37.57], zoom: 9 }}>
                  {clinicToShow}
                </Map>
              </YMaps>

              <div className={sif({ [classes.subMenu]: true, [classes.subMenu__open]: subMenuOpen })}>
                <div className={classes.subMenuCloser} onClick={setSubMenuOpen.bind(null, !subMenuOpen)} />

                {subMenuContent}
              </div>
            </>
          }

        </AppTabPanel>

      </PageLayout>
    </Layout >
  );
};