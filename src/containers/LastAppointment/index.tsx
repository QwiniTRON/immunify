import React, { useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CallIcon from '@material-ui/icons/Call';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import ApartmentIcon from '@material-ui/icons/Apartment';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import DateRangeIcon from '@material-ui/icons/DateRange';
import TimerIcon from '@material-ui/icons/Timer';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';

import { BackButton } from '../../components/BackButton';
import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';
import { Divider } from '../../components/UI/Divider';
import { AppButton } from '../../components/UI/AppButton';
import { useServer } from '../../hooks/useServer';
import { GetVisitById } from '../../server/fetchers/hospitalVisit/GetById';
import { DeleteVisit } from '../../server/fetchers/hospitalVisit';
import { UpdateVisit } from '../../server/fetchers/hospitalVisit/Update';
import { CircleLoader } from '../../components/UI/CircleLoader';


type LastAppointmentProps = {}

type LastAppointmentParams = {
  id: string
}

type AppointmentDetail = {
  id: number
  date: string
  hospital: {
    id: number
    name: string
  }
}

//#region стили
const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 18,
    padding: 20
  },

  phoneIcon: {
    verticalAlign: 'middle',
    marginRight: 10,
    color: '#A8E3F1'
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
  },

  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },

  linkButton: {
    textDecoration: 'none'
  },

  expiredVisit: {
    backgroundColor: '#eee'
  },

  editButton: {
    color: '#67CDFD',
    float: 'right',
    verticalAlign: 'top'
  },

  cancelButton: {
    color: '#777',
    float: 'right',
    verticalAlign: 'top'
  },

  ticket: {
    display: 'flex'
  },

  ticketDate: {
    flexGrow: 4,
    fontWeight: 300
  },

  ticketTime: {
    flexGrow: 3,
    fontWeight: 300,
    borderLeft: '1px solid #dadada',
    textAlign: 'center'
  },

  menuButton: {
    display: 'block',
    fontSize: 14,

    '& svg': {
      fontSize: 32
    }
  },

  calendarButton: {
    color: '#67CDFD'
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
  },

  saveButton: {
    maxWidth: 160,
    width: '100%'
  },
  
  callLink: {
    textDecoration: 'none'
  }
}));
//#endregion


// поле выбора даты
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

// поле выбора времени
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

// окно сообщение об успешном удалении
type DeletePlaceholderProps = {
  deleteNotieceOpen: boolean
  setDeleteNotieceOpen: Function
  history: any
}
const DeletePlaceholder: React.FC<DeletePlaceholderProps> = ({
  deleteNotieceOpen,
  setDeleteNotieceOpen,
  history
}) => {
  const classes = useStyles();

  return (
    <Layout title="" BackButtonCustom={<BackButton text="Вернуться к списку записей" to={`/calendar`} />}>
      <PageLayout className={classes.root}>
        <Box fontSize={24} fontWeight={500} textAlign="center">
          Запись удалена
          </Box>

        <Snackbar
          open={deleteNotieceOpen}
          autoHideDuration={TimeToRedirect}
          onClose={() => setDeleteNotieceOpen(false)}
          onAnimationEnd={() => {
            history.push('/calendar');
          }}>
          <MuiAlert onClose={() => setDeleteNotieceOpen(false)} elevation={6} variant="filled">
            Заявка отменена
            <Box p={1}><Link to={`/calendar`}>к записям</Link></Box>
          </MuiAlert>
        </Snackbar>
      </PageLayout>
    </Layout>
  );
}

// окно сообщение об успешном изменении
type UpdatePlaceholderProps = {
  editNotieceOpen: boolean
  setEditNotieceOpen: Function
  history: any
}
const UpdatePlaceholder: React.FC<UpdatePlaceholderProps> = ({
  editNotieceOpen,
  setEditNotieceOpen,
  history
}) => {
  const classes = useStyles();

  return (
    <Layout title="" BackButtonCustom={<BackButton text="Вернуться к списку записей" to={`/calendar`} />}>
      <PageLayout className={classes.root}>
        <Box fontSize={24} fontWeight={500} textAlign="center">
          Запись обновлена
          </Box>

        <Snackbar
          open={editNotieceOpen}
          autoHideDuration={TimeToRedirect}
          onClose={() => setEditNotieceOpen(false)}
          onAnimationEnd={() => {
            history.push('/calendar');
          }}>
          <MuiAlert onClose={() => setEditNotieceOpen(false)} elevation={6} variant="filled">
            запись обновлена
            <Box p={1}><Link to={`/calendar`}>к записям</Link></Box>
          </MuiAlert>
        </Snackbar>
      </PageLayout>
    </Layout>
  );
}


const TimeToRedirect = 3000;


export const LastAppointment: React.FC<LastAppointmentProps> = (props) => {
  const classes = useStyles(props);
  const history = useHistory();
  const appointmentId = useRouteMatch<LastAppointmentParams>().params.id;

  const appointmentDetailReq = useServer(GetVisitById);
  const loading = appointmentDetailReq.state.fetching;
  const success = !loading && appointmentDetailReq.state.answer.succeeded;
  const [detail, setDetail] = useState<AppointmentDetail | null>(null);

  const redirectTimer = useRef<any>(null);

  const deleteReq = useServer(DeleteVisit);
  const loadingDelete = deleteReq.state.fetching;
  const successDelete = !loadingDelete && deleteReq.state.answer.succeeded;

  const updateReq = useServer(UpdateVisit);
  const loadingUpdate = updateReq.state.fetching;
  const successUpdate = !loadingUpdate && updateReq.state.answer.succeeded;

  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedTime, handleTimeChange] = useState(new Date());
  const [error, setErrors] = useState({
    date: '',
    time: ''
  });
  const [isEdit, setIsEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteNotieceOpen, setDeleteNotieceOpen] = React.useState(false);
  const [editNotieceOpen, setEditNotieceOpen] = React.useState(false);

  /**
   * нажатие отмена
   */
  const cancelHandle = () => {
    if (isEdit) {
      return setIsEdit(false);
    }

    setDeleteOpen(true);
  }

  /**
   *  удаление заявки
   */
  const deleteHandle = () => {
    deleteReq.fetch({ id: Number(appointmentId) });
  }

  /**
   * редактирование заявки
   */
  const editHandle = () => {
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

    updateReq.fetch({
      date: new Date(timeToVisit.getTime() - userTimeZoneOffset),
      visitId: Number(appointmentId)
    });
  }


  // загрузка информации по визиту
  useEffect(() => {
    appointmentDetailReq.fetch({ visitId: Number(appointmentId) });

    return () => {
      clearTimeout(redirectTimer.current);
    }
  }, []);


  // получение информации по визиту
  useEffect(() => {
    if (success) {
      setDetail(appointmentDetailReq.state.answer.data as any);
      handleDateChange(new Date(String(appointmentDetailReq.state.answer.data?.date)));
      handleTimeChange(new Date(String(appointmentDetailReq.state.answer.data?.date)));

      appointmentDetailReq.reload();
    }
  }, [success]);


  // успешное удаление визита
  useEffect(() => {
    if (successDelete) {

      setDeleteNotieceOpen(true);
      setDeleteOpen(false);
      redirectTimer.current = setTimeout(() => {
        history.push(`/calendar`);
      }, TimeToRedirect);
    }
  }, [successDelete]);


  // успешное обновление визита
  useEffect(() => {
    if (successUpdate) {
      // updateReq.reload();

      setEditNotieceOpen(true);
      redirectTimer.current = setTimeout(() => {
        history.push(`/calendar`);
      }, TimeToRedirect);
    }
  }, [successUpdate]);


  // если визит был удалён, показываем вставку для удаления
  if (successDelete) {
    return (
      <DeletePlaceholder deleteNotieceOpen={deleteNotieceOpen} history={history} setDeleteNotieceOpen={setDeleteNotieceOpen} />
    );
  }


  // если визит был обновлён, показываем вставку для обновления
  if (successUpdate) {
    return (
      <UpdatePlaceholder editNotieceOpen={editNotieceOpen} history={history} setEditNotieceOpen={setEditNotieceOpen} />
    );
  }

  const isExpired = (Date.parse(detail?.date ?? '') - Date.now()) < 0;


  return (
    <Layout title="" BackButtonCustom={<BackButton text="Вернуться к списку записей" to={`/calendar`} />}>
      <PageLayout className={classes.root}>

        <Box component="h2" fontSize={24}>
          Запись на прием
        </Box>
        <Divider />

        {(loading || loadingDelete || loadingUpdate) && <Box textAlign="center"><CircleLoader /></Box>}

        {!loading && <div className={classes.content}>

          <Box fontWeight={400} fontSize={18}>
            {detail?.hospital.name}
          </Box>

          <Box fontSize={18} fontWeight={500}>Контакты:</Box>

          <Box mt={1}>
            <Box>
              <ApartmentIcon fontSize="large" className={classes.phoneIcon} /> {detail?.hospital?.name}
            </Box>
            <Box>
              <CallIcon color="primary" fontSize="large" className={classes.phoneIcon} /> <a className={classes.callLink} href={`tel:+${74953428501}`}>+7 (495) 342-85-01</a>
            </Box>
            <Box>
              <CallIcon color="primary" fontSize="large" className={classes.phoneIcon} /> <a className={classes.callLink} href={`tel:+${74953428502}`}>+7 (495) 342-85-02</a>
            </Box>
          </Box>

          <Divider color="gray" />

          <Box mt={1} mb={3} fontWeight={500}>
            Моя запись:

            {!isExpired && !isEdit &&
              <Button
                classes={{ root: classes.editButton }}
                disabled={loading || loadingDelete || loadingUpdate}
                onClick={() => setIsEdit(true)}
                variant="text"
                color="primary">
                изменить
              </Button>
            }

            {!isExpired && isEdit &&
              <Button
                classes={{ root: classes.cancelButton }}
                disabled={loading || loadingDelete || loadingUpdate}
                onClick={cancelHandle}
                variant="text"
                color="primary">
                отмена
              </Button>
            }
          </Box>

          {isEdit &&
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
                    format="MM/dd/yyyy"
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
          }

          {!isEdit &&
            <Box>
              <div className={classes.ticket}>
                <div className={classes.ticketDate}>
                  Дата:

                  <Box fontWeight={500}>
                    {new Date(detail?.date ?? '').toLocaleDateString('ru', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </Box>
                </div>

                <div className={classes.ticketTime}>
                  Время:

                  <Box fontWeight={500}>
                    {new Date(detail?.date ?? '').toLocaleTimeString('ru', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Box>
                </div>

              </div>
              <Divider color="gray" />

              <Box display="flex" justifyContent="space-between">
                <IconButton
                  classes={{ label: classes.menuButton }}
                  disabled={loading || loadingDelete || loadingUpdate}
                  onClick={cancelHandle}
                >
                  <CloseIcon />
                  <div>Отменить</div>
                </IconButton>
                <IconButton classes={{ label: classes.menuButton, root: classes.calendarButton }}>
                  <DateRangeIcon />
                  <div>В календарь</div>
                </IconButton>
                <IconButton
                  classes={{ label: classes.menuButton }}
                  color="primary"
                  onClick={() => history.push(
                    '/calendar/mark',
                    detail
                  )}>
                  <AddIcon />
                  <div>Я привился</div>
                </IconButton>
              </Box>
            </Box>
          }
        </div>
        }

        {!isExpired && isEdit &&
          <Box mt="auto" textAlign="center">
            <AppButton
              disabled={loading || loadingDelete || loadingUpdate}
              onClick={editHandle}
              className={classes.saveButton}>
              сохранить
            </AppButton>
          </Box>
        }

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={deleteOpen}>
            <div className={classes.paper}>
              <h2 id="transition-modal-title">Вы уверены что хотите отменить заявку?</h2>

              <Box display="flex" justifyContent="space-between" mt={2}>
                <AppButton appColor="white" onClick={deleteHandle}>отменить</AppButton>
                <AppButton onClick={() => setDeleteOpen(false)}>не отменять</AppButton>
              </Box>
            </div>
          </Fade>
        </Modal>

      </PageLayout>
    </Layout>
  );
};