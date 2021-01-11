import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CallIcon from '@material-ui/icons/Call';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import DateRangeIcon from '@material-ui/icons/DateRange';
import { useSelector } from 'react-redux';
import ApartmentIcon from '@material-ui/icons/Apartment';
import TimerIcon from '@material-ui/icons/Timer';

import { BackButton } from '../../components/BackButton';
import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';
import { Divider } from '../../components/UI/Divider';
import { AppButton } from '../../components/UI/AppButton';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { GetDetailedHospital } from '../../server/fetchers/hospital/Detailed';
import { CreateVisit } from '../../server/fetchers/hospitalVisit';
import { useServer } from '../../hooks/useServer';
import { RootState } from '../../store';
import { CircleLoader } from '../../components/UI/CircleLoader';


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
    marginRight: 10,
    color: '#A8E3F1'
  },

  content: {
    paddingBottom: 60
  },

  timeInputContainer: {
    position: 'relative'
  },

  timeInput: {
    backgroundColor: '#fff',
    borderRadius: 3,
    border: '1px solid #dadada',
    padding: 10,
    fontSize: 18,
    width: '100%',
    paddingRight: 40,

    "&::placeholder": {
      color: '#dadada'
    }
  },

  timeIcon: {
    position: 'absolute',
    right: 5,
    top: "-5px",
    fontSize: 30,
    color: '#acacac',

    '& svg': {
      fontSize: 30,
    }
  }
});


const DatePickerInput: React.FC = (props) => {
  const classes = useStyles();

  return (
    <label className={classes.timeInputContainer}>
      <input className={classes.timeInput} {...props as any} />
      <div className={classes.timeIcon}>
        <DateRangeIcon />
      </div>
    </label>
  )
}

const TimePickerInput: React.FC = (props) => {
  const classes = useStyles();

  return (
    <label className={classes.timeInputContainer}>
      <input className={classes.timeInput} {...props as any} />
      <div className={classes.timeIcon}>
        <TimerIcon />
      </div>
    </label>
  )
}


export const Appointment: React.FC<AppointmentProps> = (props) => {
  const classes = useStyles();
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
  const [selectedTime, handleTimeChange] = useState(new Date());
  const [error, setErrors] = useState({
    date: '',
    time: ''
  });


  /**
   * создание визита на приём 
   */
  const handleCreateVaisit = () => {
    if (!selectedDate) {
      return setErrors({ date: 'укажите дату и время приёма', time: '' });
    }
    if (!selectedTime) {
      return setErrors({ date: '', time: 'укажите время для приёма' });
    }

    const userTimeZoneOffset = 60000 * selectedDate.getTimezoneOffset();
    const timeToVisit = new Date(selectedDate);
    timeToVisit.setHours(selectedTime.getHours());
    timeToVisit.setMinutes(selectedTime.getMinutes());
    
    createAppointmentReq.fetch({
      patientId: Number(currentUser?.id),
      hospitalId: Number(clinicId),
      date: new Date(timeToVisit.getTime() - userTimeZoneOffset)
    });
  }

  /**
   * загрузка данных по клинике
   */
  useEffect(() => {
    clinicReq.fetch({ id: Number(clinicId) });
  }, []);

  /**
   * установка получение данных пол клинике
   */
  useEffect(() => {
    if (detailSuccess) {
      setClinicDetails(clinicReq.state.answer.data as ClinicDetailed);
      clinicReq.reload();
    }
  }, [detailSuccess]);

  /**
   * обработка успешно созданной заявки
   */
  useEffect(() => {
    if (createSuccess) {
      history.push(`/calendar/${createAppointmentReq.state.answer.data?.id}`);
      createAppointmentReq.reload();
    }
  }, [createSuccess]);


  return (
    <Layout title="" BackButtonCustom={<BackButton text="Вернуться к списку центров" simpleBack />}>
      <PageLayout className={classes.root}>

        <Box component="h2" fontSize={24}>
          Запишитесь на прием
        </Box>
        <Divider color="gray" />

        {detailLoading && <Box textAlign="center"><CircleLoader /></Box>}

        {!detailLoading &&
          <div className={classes.content}>

            <Box fontSize={18} fontWeight={500}>Контакты:</Box>

            <Box fontWeight={500}>
              {clinicDetails?.name}
            </Box>

            <Box mt={4}>
              <Box>
                <ApartmentIcon fontSize="large" className={classes.phoneIcon} /> {clinicDetails?.regionName}
              </Box>
              <Box>
                <CallIcon fontSize="large" className={classes.phoneIcon} /> +7 (495) 342-85-01
              </Box>
              <Box>
                <CallIcon fontSize="large" className={classes.phoneIcon} /> +7 (495) 342-85-02
              </Box>
            </Box>

            <Divider color="gray" />

            <Box mt={6} mb={1}>
              Моя запись:
            </Box>

            <Box display="flex">
              <Box flexGrow={1} mr={2}>
                <Box fontWeight={300}>Дата:</Box>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                  <DatePicker
                    label=""
                    value={selectedDate}
                    placeholder="укажите"
                    onChange={handleDateChange as any}
                    cancelLabel="отмена"
                    inputVariant="outlined"
                    disablePast
                    helperText={error.date}
                    error={Boolean(error.date)}
                    TextFieldComponent={DatePickerInput}
                    clearable
                  />
                </MuiPickersUtilsProvider>
              </Box>

              <Box flexGrow={1}>
                <Box fontWeight={300}>Время:</Box>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
                  <TimePicker
                    label=""
                    placeholder="укажите"
                    value={selectedTime}
                    onChange={handleTimeChange as any}
                    ampm={false}
                    minutesStep={5}
                    inputVariant="outlined"
                    TextFieldComponent={TimePickerInput}
                    helperText={error.time}
                    error={Boolean(error.time)}
                  />
                </MuiPickersUtilsProvider>
              </Box>
            </Box>

          </div>
        }

        <AppButton disabled={detailLoading || createLoading} floated onClick={handleCreateVaisit}>
          Иду
        </AppButton>

      </PageLayout>
    </Layout>
  );
};