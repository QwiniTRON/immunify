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
import { Link } from 'react-router-dom';
import { AppButton } from '../../components';



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

      <Link to="/profile">
        <AppButton floated appColor="linear">
          Добавить
        </AppButton>
        </Link>
    </Box>
  );
}

export const Vaccination: React.FC<VaccinationProps> = (props) => {
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
    let array: {
      stage: number;
      date: string;
      durationBeforeNextInMonths: number;
    }[][] = [];

    const lastVaccine = vaccine.passedStages[vaccine.passedStages.length - 1];

    let date = new Date(lastVaccine.date);

    date = new Date(date.setMonth(date.getMonth() + lastVaccine.durationBeforeNextInMonths));

    // Get quence 3, 2, 1 or 2, 1
    for (let index = 0; index < vaccine.totalStages.length; index++) {
      const ar1 = vaccine.totalStages.slice(index, vaccine.totalStages.length);

      for (let j = 0; j < vaccine.passedStages.length; j++) {
        const secondArray = vaccine.passedStages.slice(j, j + ar1.length);
        const secondArrayStages = secondArray.map((el) => el.stage);

        if (arraysEqual(ar1, secondArrayStages)) {
          array.push(secondArray);

          for (let k = j; k < j + ar1.length; k++) {
            vaccine.passedStages[k] = -1 as any;
          }
        }
      }
    }

    // Get signle 1 or 2 or 3
    for (let index = 0; index < vaccine.totalStages.length; index++) {
      const elem = vaccine.totalStages[index];

      for (let j = 0; j < vaccine.passedStages.length; j++) {
        const secondElem = vaccine.passedStages[j];

        if (elem === secondElem.stage) {
          array.push([secondElem]);

          vaccine.passedStages[j] = -1 as any;
        }
      }
    }

    array.forEach((item) => {
      const needToAdd = vaccine.totalStages
        .filter((x) => !item.map((el) => el.stage).includes(x));

      needToAdd.forEach((stage) => {
        item.push({ stage, date: 'none', durationBeforeNextInMonths: -1 })
      });

      item = item.sort((a, b) => a.stage - b.stage);
    });

    const sorted = array.sort((a, b) => {
      let aMaxDate = new Date(0);
      let bMaxDate = new Date(0);

      const aAr = a.map((el) => new Date(el.date));
      const bAr = b.map((el) => new Date(el.date));

      aAr.forEach(x => {
        if (!isNaN(x.getTime()) && x > aMaxDate) aMaxDate = x;
      });

      bAr.forEach(x => {
        if (!isNaN(x.getTime()) && x > bMaxDate) bMaxDate = x;
      });

      return aMaxDate.getTime() - bMaxDate.getTime();
    });

    return (
      <Box marginY={1} key={vaccine.id + vaccine.name + index.toString()}>
        <VaccineCard
          vaccine={{
            date: `Следующая вакцинация не поздее ${date.toLocaleDateString('ru-RU')}`,
            for: vaccine.detailed,
            name: vaccine.name,
            stadies: sorted.map((el, index) => el.map((stady) => ({
              name: index > 0 ? `R${stady.stage}` : `V${stady.stage}`,
              isVaccined: stady.durationBeforeNextInMonths !== -1
            })))
          }}
          status={new Date() >= date ? "bad" : "ok"}
        />
      </Box>
    );
  });

  return (
    <Layout title="Прошедшие вакцинации" domainPage>
      <PageLayout>

        {vaccinesToShow.length == 0 ?
          <VaccinationPlaceholder />
          :
          vaccinesToShow
        }

      </PageLayout>
    </Layout>
  );
};

function arraysEqual(a1: any, a2: any): boolean {
  return JSON.stringify(a1) === JSON.stringify(a2);
}