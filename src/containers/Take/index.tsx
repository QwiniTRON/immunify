import React from 'react';
import { Layout } from '../../components/Layout/Layout';
import { ReactComponent as TakeCardIcon } from '../../assets/takeCard.svg';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';

type TakeProps = {

}

const TakePlaceholder: React.FC<any> = (props) => {
    return (
        <Box textAlign="center" pt={3} mb={8}>
            <TakeCardIcon />

            <Box fontSize={18} fontWeight={500} m="0 auto" width={0.5} mt={4}>
                У Вас нет предстоящих записей
            </Box>
        </Box>
    );
}

export const Take: React.FC<TakeProps> = (props) => {
    return (
        <Layout title="Запись" domainPage>
            <PageLayout>
                <TakePlaceholder />
            </PageLayout>
        </Layout>
    );
};