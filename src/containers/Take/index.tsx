import React from 'react';
import { Layout } from '../../components/Layout/Layout';

import { PageLayout } from '../../components/UI/PageLayout';

type TakeProps = {

}

export const Take: React.FC<TakeProps> = (props) => {
    return (
        <Layout title="Запись">
            <PageLayout>
                take
            </PageLayout>
        </Layout>
    );
};