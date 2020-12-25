import React, { useEffect, useRef, useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import CallIcon from '@material-ui/icons/Call';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import { BackButton } from '../../components/BackButton';
import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';
import { Divider } from '../../components/UI/Divider';
import { AppButton } from '../../components/UI/AppButton';
import { AppButtonGroup } from '../../components/UI/ButtonGroup';
import Paper from '@material-ui/core/Paper';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { useServer } from '../../hooks/useServer';
import { GetVisitById } from '../../server/fetchers/hospitalVisit/GetById';
import { DeleteVisit } from '../../server/fetchers/hospitalVisit';
import { UpdateVisit } from '../../server/fetchers/hospitalVisit/Update';
import { Loader } from '../../components';


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

const useStyles = makeStyles((theme) => ({
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
  }
}));


const TimeToRedirect = 3000;

export const LastAppointment: React.FC<LastAppointmentProps> = (props) => {
  const clases = useStyles(props);
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
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteNotieceOpen, setDeleteNotieceOpen] = React.useState(false);
  const [editNotieceOpen, setEditNotieceOpen] = React.useState(false);


  const cancelHandle = () => {
    if (isEdit) {
      return setIsEdit(false);
    }

    setDeleteOpen(true);
  }


  const deleteHandle = () => {
    deleteReq.fetch({ id: Number(appointmentId) });
  }


  const editHandle = () => {
    if (!selectedDate) {
      return setError('дата должны быть выбрана');
    }
    
    updateReq.fetch({ date: selectedDate, visitId: Number(appointmentId) });
  }


  useEffect(() => {
    appointmentDetailReq.fetch({ visitId: Number(appointmentId) });

    return () => {
      clearTimeout(redirectTimer.current);
    }
  }, []);


  useEffect(() => {
    if (success) {
      setDetail(appointmentDetailReq.state.answer.data as any);
      handleDateChange(new Date(String(appointmentDetailReq.state.answer.data?.data)));

      appointmentDetailReq.reload();
    }
  }, [success]);


  useEffect(() => {
    if (successDelete) {
      // deleteReq.reload();

      setDeleteNotieceOpen(true);
      setDeleteOpen(false);
      redirectTimer.current = setTimeout(() => {
        history.push('/calendar');
      }, TimeToRedirect);
    }
  }, [successDelete]);


  useEffect(() => {
    if (successUpdate) {
      // updateReq.reload();

      setEditNotieceOpen(true);
      redirectTimer.current = setTimeout(() => {
        history.push('/calendar');
      }, TimeToRedirect);
    }
  }, [successUpdate]);


  if (successDelete) {
    return (
      <Layout title="" BackButtonCustom={<BackButton text="Вернуться к списку записей" to="/calendar" />}>
        <PageLayout className={clases.root}>
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
            <Box p={1}><Link to="/calendar">к записям</Link></Box>
            </MuiAlert>
          </Snackbar>
        </PageLayout>
      </Layout>
    );
  }


  if (successUpdate) {
    return (
      <Layout title="" BackButtonCustom={<BackButton text="Вернуться к списку записей" to="/calendar" />}>
        <PageLayout className={clases.root}>
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
            <Box p={1}><Link to="/calendar">к записям</Link></Box>
            </MuiAlert>
          </Snackbar>
        </PageLayout>
      </Layout>
    );
  }


  return (
    <Layout title="" BackButtonCustom={<BackButton text="Вернуться к списку записей" to="/calendar" />}>
      <PageLayout className={clases.root}>
        {(loading || loadingDelete || loadingUpdate) && <Loader />}

        <Box component="h2" fontSize={24}>
          Записаться на прием
        </Box>
        <Divider />

        {!loading && <div className={clases.content}>

          <Box fontWeight={500}>
            {detail?.hospital.name}
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

          {isEdit &&
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
                helperText={error}
                error={Boolean(error)}
              />
            </MuiPickersUtilsProvider>
          }

          {!isEdit &&
            <Paper elevation={3}>
              <Box p={2}>
                <Box fontWeight={500}>{detail?.hospital.name}</Box>
                <Box fontWeight={500}>{new Date(String(detail?.date)).toLocaleString('ru', {
                  hour: '2-digit', minute: '2-digit',
                  day: '2-digit', year: 'numeric', month: 'short'
                })}</Box>
              </Box>
            </Paper>}

          {!isEdit && <div className={clases.notationLink}>
            <Link to="/">Добавить событие в календарь</Link>
          </div>}
        </div>}

        <AppButtonGroup floated>
          <AppButton appColor="white" disabled={loading || loadingDelete || loadingUpdate} onClick={cancelHandle}>
            {isEdit ? 'отмена' : 'Отменить'}
          </AppButton>
          {!isEdit && <AppButton disabled={loading || loadingDelete || loadingUpdate} onClick={() => setIsEdit(true)}>
            Изменить
          </AppButton>}

          {isEdit && <AppButton disabled={loading || loadingDelete || loadingUpdate} onClick={editHandle}>
            сохранить
          </AppButton>}
        </AppButtonGroup>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={clases.modal}
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={deleteOpen}>
            <div className={clases.paper}>
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