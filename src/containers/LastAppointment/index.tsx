import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CallIcon from '@material-ui/icons/Call';

import { BackButton } from '../../components/BackButton';
import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';
import { Divider } from '../../components/UI/Divider';
import { AppButton } from '../../components/UI/AppButton';
import { AppButtonGroup } from '../../components/UI/ButtonGroup';
import Paper from '@material-ui/core/Paper';
import { Link, useRouteMatch } from 'react-router-dom';
import { useServer } from '../../hooks/useServer';


type LastAppointmentProps = {}

type LastAppointmentParams = {
  id: string
}

const useStyles = makeStyles({
  root: {
    fontSize: 18,
    padding: 15
  },

  phoneIcon: {
    verticalAlign: 'middle',
    marginRight: 10
  },

  content: {
    paddingBottom: 60
  },

  notationLink: {
    textAlign: 'center',
    margin: '10px 0',

    '& a': {
      textDecoration: 'none',
      color: '#000'
    }
  }
});

export const LastAppointment: React.FC<LastAppointmentProps> = (props) => {
  const clases = useStyles();
  const appointmentId = useRouteMatch<LastAppointmentParams>().params.id;

  // const visitsList = useServer();
  // const loading = visitsList.state.fetching;
  // const success = !loading && visitsList.state.answer.succeeded;
  // const [visits, setVisits] = useState<any>(1);


  return (
    <Layout title="" BackButtonCustom={<BackButton text="Вернуться к списку записей" to="/calendar" />}>
      <PageLayout className={clases.root}>
        <div className={clases.content}>
          <Box component="h2" fontSize={24}>
            Записаться на прием
        </Box>
          <Divider />

          <Box fontWeight={500}>
            Клинико-диагностический центр МЕДСИ (Марьино)
          </Box>
          <Box>
            Москва, улица Перерва, дом 53
          </Box>

          <Box mt={4}>
            <Box>
              <CallIcon color="primary" fontSize="large" className={clases.phoneIcon} /> +7 (495) 342-85-01
            </Box>
            <Box>
              <CallIcon color="primary" fontSize="large" className={clases.phoneIcon} /> +7 (495) 342-85-02
            </Box>
          </Box>



          <Box mt={6} mb={4}>
            Моя запись:
          </Box>

          <Paper elevation={3}>
            <Box p={2}>
              <Box fontWeight={500}>Клинико-диагностический центр МЕДСИ (Марьино)</Box>
              <Box>Москва, улица Перерва, дом 53</Box>
              <Box fontWeight={500}>30 ноября 11:00</Box>
            </Box>
          </Paper>

          <div className={clases.notationLink}>
            <Link to="/">Добавить событие в календарь</Link>
          </div>
        </div>

        <AppButtonGroup floated>
          <AppButton appColor="white">
            Отменить
          </AppButton>
          <AppButton>
            Изменить
          </AppButton>
        </AppButtonGroup>
      </PageLayout>
    </Layout>
  );
};