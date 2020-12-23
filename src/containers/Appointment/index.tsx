import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CallIcon from '@material-ui/icons/Call';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";

import { BackButton } from '../../components/BackButton';
import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';
import { Divider } from '../../components/UI/Divider';
import { AppButton } from '../../components/UI/AppButton';


type AppointmentProps = {}

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
  }
});

export const Appointment: React.FC<AppointmentProps> = (props) => {
  const [selectedDate, handleDateChange] = useState(new Date());
  const clases = useStyles();

  return (
    <Layout title="" BackButtonCustom={<BackButton text="Вернуться к списку центров" to="/" />}>
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
            <Box>
              <CallIcon color="primary" fontSize="large" className={clases.phoneIcon} /> +7 (495) 342-85-03
          </Box>
            <Box>
              <CallIcon color="primary" fontSize="large" className={clases.phoneIcon} /> +7 (495) 342-85-03
          </Box>
            <Box>
              <CallIcon color="primary" fontSize="large" className={clases.phoneIcon} /> +7 (495) 342-85-03
          </Box>
          </Box>



          <Box mt={6} mb={4}>
            Моя запись:
          </Box>
          <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <DateTimePicker
              label="дата последней вакцинации"
              value={selectedDate}
              onChange={handleDateChange as any}
              fullWidth
              cancelLabel="отмена"
              inputVariant="outlined"
              disablePast
              ampm={false}
            />
          </MuiPickersUtilsProvider>
        </div>

        <AppButton floated>
          Иду
        </AppButton>
      </PageLayout>
    </Layout>
  );
};