import React from 'react';
import Box from '@material-ui/core/Box';

import { Layout } from '../../components/Layout/Layout';
import { VaccineCard } from '../../components/UI/VaccineCard';
import { PageLayout } from '../../components/UI/PageLayout';


type VaccinationProps = {}

export const Vaccination: React.FC<VaccinationProps> = (props) => {
  return (
    <Layout title="Прошедшие вакцинации" domainPage>
      <PageLayout>

        <Box marginY={1}>
          <VaccineCard
            vaccine={{
              date: 'Следующая вакцинация не поздее марта 2021 года',
              for: 'Защищает от ВПЧ',
              name: 'Гардасил',
              stadies: [
                { name: 'v1', isVaccined: true },
                { name: 'v2', isVaccined: false },
                { name: 'v3', isVaccined: false }
              ]
            }}
          />
        </Box>
        <Box marginY={1}>
          <VaccineCard
            vaccine={{
              date: 'Следующая вакцинация не поздее марта 2021 года',
              for: 'Защищает от ВПЧ',
              name: 'Гардасил',
              stadies: [
                { name: 'v1', isVaccined: true },
                { name: 'v2', isVaccined: false },
                { name: 'v3', isVaccined: false }
              ]
            }}
          />
        </Box>
      </PageLayout>
    </Layout>
  );
};