import React, { useLayoutEffect, useEffect } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { ReactComponent as TakeCardIcon } from '../../assets/takeCard.svg';
import Box from '@material-ui/core/Box';
import { useSelector } from 'react-redux';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';
import { RootState } from '../../store';
import { useServer } from '../../hooks/useServer';
import { GetHospitalByPatient } from '../../server/fetchers/hospitalVisit';

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
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const visitsList = useServer(GetHospitalByPatient);
    const loading = visitsList.state.fetching;
    const success = !loading && visitsList.state.answer.succeeded;

    useLayoutEffect(() => {
        visitsList.fetch({ patientId: Number(currentUser?.id) });
    }, []);

    useEffect(() => {
        if(success) {
            visitsList.fetch({ patientId: Number(currentUser?.id) });
        }
    }, [success]);

    return (
        <Layout title="Запись" domainPage>
            <PageLayout>

            </PageLayout>
        </Layout>
    );
};