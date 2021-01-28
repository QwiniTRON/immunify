import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';
import { BackButton } from '../../components/BackButton';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { useServer } from '../../hooks/useServer';
import { AppLinkButton } from '../../components/UI/AppLinkButton';
import { GetVaccineById, GetVaccinationByPatient, PatientVaccinations, GetDiseases } from '../../server';
import { CircleLoader } from '../../components/UI/CircleLoader';
import { MarkDown } from '../../components/MarkDown';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';

type VaccineRouteParams = {
  id: string
}


type Diseas = {
  id: number
  name: string
}

type VaccineProps = {}

const useStyles = makeStyles({
  linkButton: {
    textDecoration: 'none'
  },

  menuButton: {
    display: 'block',
    fontSize: 14,

    '& svg': {
      fontSize: 32
    }
  },

  vaccinedNotice: {
    color: '#67CDFD',
    border: '1px solid #67CDFD',
    padding: 5,
    borderRadius: 2,
    textAlign: 'center'
  },

  linkDiseas: {
    color: 'var(--textColor)',
    display: 'inline-block',
    padding: 5,
    fontSize: 18,

    '&:visited': {
      color: 'currentColor'
    }
  }
});

type VaccineType = {
  id: number
  name: string
  detailedShort: string
  detailedFull: string
  diseaseIds: number[]
}

export const Vaccine: React.FC<VaccineProps> = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const vaccineId = useRouteMatch<VaccineRouteParams>().params.id;
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [vaccine, setVaccine] = useState<VaccineType>({
    id: 0,
    name: '',
    detailedFull: '',
    detailedShort: '',
    diseaseIds: []
  });
  const [vaccinations, setVaccinations] = useState<PatientVaccinations>([]);
  const [diseases, setDiseases] = useState<Diseas[]>([]);

  const diseasRequest = useServer(GetDiseases);
  const fetcher = useServer(GetVaccineById);
  const vaccinationsRequest = useServer(GetVaccinationByPatient);


  // запросы 
  useEffect(() => {
    fetcher.fetch({ id: Number(vaccineId) });
    vaccinationsRequest.fetch({
      patientId: Number(currentUser?.id)
    });
    diseasRequest.fetch(undefined);

    return fetcher.cancel;
  }, []);

  const loading = diseasRequest.state.fetching || vaccinationsRequest.state.fetching || fetcher.state.fetching;
  const success = !fetcher.state.fetching && fetcher.state.answer.succeeded;
  const vaccinationsSuccess = !vaccinationsRequest.state.fetching && vaccinationsRequest.state.answer.succeeded;
  const successDiseas = !diseasRequest.state.fetching && diseasRequest.state.answer.succeeded;


  if (success) {
    setVaccine(fetcher.state.answer.data! as VaccineType);
    fetcher.reload();
  }

  // пришли болезни
  if (successDiseas) {
    setDiseases(diseasRequest.state.answer.data as Diseas[]);
    diseasRequest.reload();
  }

  // пришли вакцинации для пациента
  if (vaccinationsSuccess) {
    const userVaccinations = vaccinationsRequest.state.answer.data as PatientVaccinations;
    setVaccinations(userVaccinations);
    vaccinationsRequest.reload();
  }


  /**
  * обработка клика кнопки "я привит"
  */
  const takeHandle = () => {
    history.push('/vaccination/add', { type: 'vaccine', data: vaccine });
  }

  const currentVaccination = vaccinations.find((vaccination) => vaccination.name == vaccine.name);
  const isVaccined = Boolean(currentVaccination);
  const vaccinationDate = currentVaccination?.passedStages
    ?.reduce((result: any, stage: any) => stage.date > result?.stage ? stage : result, currentVaccination?.passedStages?.[0])
    ?.date;

  const relatedDiseases = diseases.filter(diseas => vaccine.diseaseIds.includes(diseas.id));

  
  return (
    <Layout title="" BackButtonCustom={<BackButton simpleBack text="Вернуться к заболеванию" />}>
      <PageLayout>

        <Box p="15px">
          {loading &&
            <Box textAlign="center"><CircleLoader /></Box>
          }

          {(!vaccineId || (!vaccine && !loading)) &&
            <Box textAlign="center">
              такая вацина не нашлась

            <Box marginY={2} color="#000"><Link to="/passport">иммунный паспорт</Link></Box>
            </Box>
          }

          {vaccine && !loading &&
            <Box fontSize={18}>
              <Box mb={2} display="grid" justifyContent="space-between" gridAutoFlow="column" alignItems="center">
                <Box fontWeight={500} fontSize={24} color="#9BC83F">
                  {vaccine.name}
                </Box>

                {isVaccined &&
                  <div className={classes.vaccinedNotice}>Я привит</div>
                }

                {!isVaccined &&
                  <IconButton
                    classes={{ label: classes.menuButton }}
                    onClick={takeHandle}
                    color="primary"
                  >
                    <AddIcon />
                    <div>Я привит</div>
                  </IconButton>
                }
              </Box>


              <Box mb={2}>
                <MarkDown md={vaccine.detailedFull} />
              </Box>

              {/* список связанных болезней */}
              <Box>
                Болезни:
              </Box>
              <Box>
                {relatedDiseases.map(rd =>
                (
                  <div key={rd.id}>
                    <Link className={classes.linkDiseas} to={`/passport/${rd.id}`}> {rd.name} </Link>
                  </div>
                ))
                }
              </Box>


              {isVaccined &&
                <Box mt={3}>
                  <Box fontWeight={500}>Последняя вакцинация:</Box>
                  <Box>{new Date(vaccinationDate).toLocaleDateString('ru')}</Box>
                </Box>
              }
            </Box>
          }

        </Box>


        <AppLinkButton to={
          { pathname: '/passport/take', state: { type: 'vaccine', data: vaccine } }
        } className={classes.linkButton}
          disabled={loading}
          floated>
          Записаться
        </AppLinkButton>

      </PageLayout>
    </Layout >
  );
};