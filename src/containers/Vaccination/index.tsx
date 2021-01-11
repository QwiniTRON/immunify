import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { useSelector } from 'react-redux';
import { ReactComponent as VaccinationIcon } from '../../assets/vaccination.svg';

import { Layout } from '../../components/Layout/Layout';
import { VaccineCard } from '../../components/UI/VaccineCard';
import { PageLayout } from '../../components/UI/PageLayout';

import { useServer } from '../../hooks/useServer';

import { GetVaccinationByPatient, PatientVaccinations } from '../../server';
import { RootState } from '../../store';
import { CircleLoader } from '../../components/UI/CircleLoader';
import { AppLinkButton } from '../../components/UI/AppLinkButton';
import { makeStyles } from '@material-ui/core/styles';



type VaccinationProps = {}

const VaccinationPlaceholder: React.FC = () => {
  return (
    <Box>
      <Box textAlign="center" mt={1}>
        <VaccinationIcon />
      </Box>

      <Box fontSize={24} fontWeight={500} textAlign="center" width={0.8} m="16px auto">
        У Вас нет отмеченных вакцинаций
      </Box>
    </Box>
  );
}

const useStyles = makeStyles({
  page: {
    padding: '15px 15px 65px 15px'
  }
});

export const Vaccination: React.FC<VaccinationProps> = (props) => {
  const classes = useStyles();

  const vaccinations = useServer(GetVaccinationByPatient);
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [vaccines, setVaccines] = useState<PatientVaccinations>([]);

  useEffect(() => {
    vaccinations.fetch({
      patientId: Number(currentUser?.id),
    });

    return vaccinations.cancel;
  }, []);

  const loading = vaccinations.state.fetching;
  const success = !loading && vaccinations.state.answer.succeeded;

  if (success && vaccinations.state.answer.data !== undefined) {
    setVaccines(vaccinations.state.answer.data);
    vaccinations.reload();
  }

  const copiedVaccines: PatientVaccinations = JSON.parse(JSON.stringify(vaccines));

  const vaccinesToShow = copiedVaccines.map((vaccine, index) => {
    console.log(vaccine);
    
    const lastVaccination = vaccine.passedStages[vaccine.passedStages.length - 1];

    let startDate = new Date(lastVaccination.date);
    startDate = new Date(startDate.setMonth(startDate.getMonth() + lastVaccination.durationStartInMonths));

    let endDate = new Date(lastVaccination.date);
    endDate = new Date(endDate.setMonth(endDate.getMonth() + lastVaccination.durationEndInMonths));

    let color: 'green' | 'red' | 'yellow' = 'green';

    const currentDate = new Date();

    if (currentDate >= startDate) {
      if (currentDate <= endDate) color = 'yellow';
      else color = 'red';
    }

    return (
      <Box marginY={1} key={vaccine.id + vaccine.name + index.toString()}>
        <VaccineCard
          vaccine={{
            id: vaccine.id,
            date: `Следующая вакцинация не поздее ${startDate.toLocaleDateString('ru-RU')}`,
            name: vaccine.name,
            detailed: vaccine.detailed
          }}
          status={color}
        />
      </Box>
    );
  });

  return (
    <Layout title="Прошедшие вакцинации" domainPage>
      <PageLayout className={classes.page}>

        {vaccinations.state.fetching && <Box m="15px auto"><CircleLoader /></Box>}
        {!vaccinations.state.fetching &&
          <>
            {
              vaccinesToShow.length === 0 ?
                <VaccinationPlaceholder />
                :
                vaccinesToShow
            }

            <AppLinkButton to="/vaccination/add" floated appColor="linear">
              Добавить
            </AppLinkButton>
          </>
        }

      </PageLayout>
    </Layout>
  );
};

function arraysEqual(a1: any, a2: any): boolean {
  return a1.toString() === a2.toString();
}