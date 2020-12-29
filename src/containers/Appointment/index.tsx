import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CallIcon from '@material-ui/icons/Call';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import { useSelector } from 'react-redux';

import { BackButton } from '../../components/BackButton';
import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';
import { Divider } from '../../components/UI/Divider';
import { AppButton } from '../../components/UI/AppButton';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { GetDetailedHospital } from '../../server/fetchers/hospital/Detailed';
import { CreateVisit } from '../../server/fetchers/hospitalVisit';
import { useServer } from '../../hooks/useServer';
import { Loader } from '../../components';
import { RootState } from '../../store';


type AppointmentParams = {
  id: string
}

type AppointmentProps = {}

type ClinicDetailed = {
  coordinate: string
  id: number
  name: string
  regionName: string
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
  }
});


export const Appointment: React.FC<AppointmentProps> = (props) => {
  const clases = useStyles();
  const history = useHistory();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const createAppointmentReq = useServer(CreateVisit);
  const createLoading = createAppointmentReq.state.fetching;
  const createSuccess = !createLoading && createAppointmentReq.state.answer.succeeded;

  const clinicReq = useServer(GetDetailedHospital);
  const clinicId = useRouteMatch<AppointmentParams>().params.id;
  const detailLoading = clinicReq.state.fetching;
  const detailSuccess = !detailLoading && clinicReq.state.answer.succeeded;
  const [clinicDetails, setClinicDetails] = useState<ClinicDetailed | null>(null);

  const [selectedDate, handleDateChange] = useState(new Date());
  const [error, setErrors] = useState({
    date: ''
  });


  const handleCreateVaisit = () => {
    if(!selectedDate) {
      return setErrors({date: 'укажите дату и время приёма'});
    }

    const useTimeZoneOffset = 60000 * selectedDate.getTimezoneOffset();
    createAppointmentReq.fetch({
      patientId: Number(currentUser?.id),
      hospitalId: Number(clinicId),
      date: new Date(selectedDate.getTime() - useTimeZoneOffset)
    });
  }

  useEffect(() => {
    clinicReq.fetch({ id: Number(clinicId) });
  }, []);

  useEffect(() => {
    if (detailSuccess) {
      setClinicDetails(clinicReq.state.answer.data as ClinicDetailed);
      clinicReq.reload();
    }
  }, [detailSuccess]);

  useEffect(() => {
    if (createSuccess) {
      history.push(`/calendar/${createAppointmentReq.state.answer.data?.id}`);
      createAppointmentReq.reload();
    }
  }, [createSuccess]);


  return (
    <Layout title="" BackButtonCustom={<BackButton text="Вернуться к списку центров" simpleBack />}>
      <PageLayout className={clases.root}>

        <Box component="h2" fontSize={24}>
          Записаться на прием
        </Box>
        <Divider />

        {detailLoading && <Loader />}

        {!detailLoading &&
          <div className={clases.content}>


            <Box fontWeight={500}>
              {clinicDetails?.name}
            </Box>
            <Box>
              {clinicDetails?.regionName}
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
                helperText={error.date}
                error={Boolean(error.date)}
                
              />
            </MuiPickersUtilsProvider>
          </div>
        }

        <AppButton disabled={detailLoading || createLoading} floated onClick={handleCreateVaisit}>
          Иду
        </AppButton>

      </PageLayout>
    </Layout>
  );
};