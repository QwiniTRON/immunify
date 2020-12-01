import react from 'react';

import { DiseasCard } from '../../components/UI/DiseasCard';
import { PageLayout } from '../../components/UI/PageLayout';

type PassportProps = {

}

export const Passport: React.FC<PassportProps> = (props) => {
 return (
  <PageLayout>
      <DiseasCard to={'/passport/:id'} name="Гепатит В" risks={['high', 'high', 'low']} />
      <DiseasCard to={'/passport/:id'} name="Корь" risks={['low', 'high', 'low']} />
      <DiseasCard to={'/passport/:id'} name="Грипп" risks={['low', 'medium', 'low']} />
  </PageLayout>
 );
};