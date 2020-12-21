import react from 'react';
import { Layout } from '../../components/Layout/Layout';

import { PageLayout } from '../../components/UI/PageLayout';

type CalendarProps = {

}

export const Calendar: React.FC<CalendarProps> = (props) => {
    return (
        <Layout title="Календарь">
            <PageLayout>
                calendar
            </PageLayout>
        </Layout>
    );
};