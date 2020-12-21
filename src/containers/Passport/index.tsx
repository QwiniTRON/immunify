import react from 'react';
import { Layout } from '../../components/Layout/Layout';

import { DiseasCard } from '../../components/UI/DiseasCard';
import { PageLayout } from '../../components/UI/PageLayout';

type PassportProps = {

}

export const Passport: React.FC<PassportProps> = (props) => {
    return (
        <Layout title="Иммунный пасспорт" titleCurrentName>
            <PageLayout>
                <DiseasCard to={'/passport/:id'} name="Гепатит В" risks={['high', 'high', 'low']} />
                <DiseasCard to={'/passport/:id'} name="Корь" risks={['low', 'high', 'low']} />
                <DiseasCard to={'/passport/:id'} name="Грипп" risks={['low', 'medium', 'low']} />
            </PageLayout>
        </Layout>
    );
};