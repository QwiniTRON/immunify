import React, { useEffect, useRef, useState } from 'react';
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
    padding: '0'
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
    background: 'linear-gradient(180deg, #9BC835 0%, #A8E3F1 100%)',
    borderRadius: '45px 45px 0 0',
    padding: '0 20px 55px 20px',
    borderTop: '3px solid #9BC83F',
    transform: 'translateY(calc(100% - 35px))',
    transition: 'transform 0.1s ease'
  },

  subMenuCloser: {
    height: 2,
    backgroundColor: '#777',
    borderRadius: 1,
  },

  subMenuContainer: {
    padding: 10,
    cursor: 'pointer',
    margin: '0 auto 10px',
    width: 80,
  },

  subMenu__open: {
    transition: 'transform 0.3s ease',
    transform: 'translateY(0%)'
  },

  takeLink: {
    fontSize: 18,
    fontWeight: 300,
    color: '#fff',
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
    backgroundColor: '#fff',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginLeft: 10,

    '& svg': {
      color: '#9BC83F'
    }
  }
});


export const ChooseClinic: React.FC<ChooseClinicProps> = (props) => {
  const classes = useStyles();
  const routeData: ChooseClinicRouteState | undefined = useLocation<ChooseClinicRouteState>().state;

  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const isSubMenuOpen = useRef(subMenuOpen);
  isSubMenuOpen.current = subMenuOpen;

  const clinicsReq = useServer(GetHospitals);
  const loading = clinicsReq.state.fetching;
  const success = !loading && clinicsReq.state.answer.succeeded;

  const [tabValue, setTabValue] = useState(0);

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [clinic, setClinic] = useState<Clinic | null>(null);



  // 
  useEffect(() => {
    clinicsReq.fetch(undefined);
  }, []);

  // 
  useEffect(() => {
    if (success) {
      setClinics(clinicsReq.state.answer.data! as Clinic[]);
      clinicsReq.reload();
    }
  }, [success]);

  // 
  useEffect(() => {
    const bottomMenuHeight = 56;
    let subMenu: HTMLElement | null = null;
    let subMenuHeight = 0;
    let isModified = 0;


    let mousemoveListener = (e: MouseEvent | TouchEvent) => {
      if (subMenu) {

        if(e.type == 'mousemove') e.preventDefault();

        const clientY = e instanceof TouchEvent ? e.touches[0]?.clientY ?? 0 : e.clientY;
        const bottom = Math.max(window.innerHeight - clientY - bottomMenuHeight, 0);
        const transformProccent = 80 - Math.min(Math.round(bottom / subMenuHeight * 100), 80);

        isModified++;

        subMenu!.style.transform = `translateY(${transformProccent}%)`;
      }
    };

    const mousedownListener = (e: MouseEvent | TouchEvent) => {
      if ((e.target as HTMLElement).closest('#submenuCloser')) {
        subMenu = (e.target as HTMLElement).closest('#submenu');
        subMenuHeight = Number(subMenu?.offsetHeight);

        subMenu!.style.transform = isSubMenuOpen.current ? "translateY(0%)" : "translateY(calc(100% - 35px))";
        subMenu!.style.transition = "none";

        document.addEventListener('mousemove', mousemoveListener);
        if(e.type == "touchstart") document.addEventListener('touchmove', mousemoveListener);
      }
    };

    const mouseupListener = (e: MouseEvent | TouchEvent) => {
      if (subMenu) {
        subMenu!.style.cssText = "";
      }

      if (isModified > 5) {
        const clientY = e instanceof TouchEvent ? e.changedTouches[0]?.clientY ?? 0 : e.clientY;
        const bottom = Math.max(window.innerHeight - clientY - bottomMenuHeight, 0);
        const transformProccent = 80 - Math.min(Math.round(bottom / subMenuHeight * 100), 80);

        if (transformProccent > 40) setSubMenuOpen(false);
        else setSubMenuOpen(true);
      }

      isModified = 0;

      document.removeEventListener('mousemove', mousemoveListener);
      if(e.type == "touchend") document.removeEventListener('touchmove', mousemoveListener);
    };

    // нажатие
    document.addEventListener('mousedown', mousedownListener);
    document.addEventListener('touchstart', mousedownListener);

    // конец действия (отжатие)
    document.addEventListener('mouseup', mouseupListener);
    document.addEventListener('touchend', mouseupListener);


    return () => {
      document.removeEventListener('mousedown', mousedownListener);
      document.removeEventListener('mouseup', mouseupListener);
      document.removeEventListener('mousemove', mousemoveListener);

      document.removeEventListener('touchstart', mousedownListener);
      document.removeEventListener('touchend', mouseupListener);
      document.removeEventListener('touchmove', mousemoveListener);
    };
  }, []);

  // 
  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  // точки клиник на карте
  let clinicToShow = clinics.filter(x => x.latitude !== "" && x.longitude !== "").map((clinic) => {
    const latitude = global.parseFloat(clinic.latitude);
    const longitude = global.parseFloat(clinic.longitude);

    return (
      <Placemark key={clinic.id} geometry={[latitude, longitude]} onClick={() => (setClinic(clinic), setSubMenuOpen(true))} />
    );
  });


  // 
  let subMenuContent: JSX.Element | null = null;
  if (!clinic) {
    subMenuContent = (
      <Box fontSize={18} fontWeight={500} color="#fff">
        клиника не выбрана
      </Box>
    );
  }

  // 
  if (clinic) {
    subMenuContent = (
      <>
        <Box fontSize={18} fontWeight={500} color="white">
          {clinic.name}
        </Box>
        <Box fontSize={18} fontWeight={300} color="white">
          {clinic.address}
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

        <Box marginX="20px">
          <Box component="h2" fontSize={24} fontWeight={500} marginY={1}>
            Выберите медцентр
          </Box>

          <Divider />
          <Box mb={1} >
            <Tabs variant="fullWidth" indicatorColor="primary" value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
              <Tab label="Список" textColor="#000" />
              <Tab label="карта" textColor="#000" />
            </Tabs>
          </Box>
        </Box>

        <AppTabPanel value={tabValue} index={0} className={classes.content} >
          <Box p={1} marginX="20px">

            {loading && <Box m={3}><Loader /></Box>}

            {!loading && clinics.map((c) => (
              <Box marginY={2} key={c.id}>
                <InfoCard data={[
                  { description: c.address, title: c.name }
                ]}
                  detailText="Позвонить и записаться"
                  to={`/passport/appointment/${c.id}`}
                />
              </Box>
            ))
            }

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

              <div id="submenu" className={sif({ [classes.subMenu]: true, [classes.subMenu__open]: subMenuOpen })}>
                <div id="submenuCloser" className={classes.subMenuContainer} onClick={setSubMenuOpen.bind(null, !subMenuOpen)}>
                  <div className={classes.subMenuCloser} />
                </div>

                {subMenuContent}
              </div>
            </>
          }

        </AppTabPanel>

      </PageLayout>
    </Layout >
  );
};