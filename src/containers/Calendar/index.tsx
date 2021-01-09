import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { ReactComponent as TakeCardIcon } from '../../assets/takeCard.svg';

import { PageLayout } from '../../components/UI/PageLayout';
import { useSelector } from 'react-redux';
import { useServer } from '../../hooks/useServer';
import { GetHospitalByPatient } from '../../server/fetchers/hospitalVisit';
import { RootState } from '../../store';
import { AppLinkButton } from '../../components/UI/AppLinkButton';
import { VisitCard } from '../../components/UI/VisitCard';

type CalendarProps = {

}

type Visit = {
    date: string
    hospital: {
        id: number
        name: string
    }
    id: number
}

const useStyles = makeStyles({
    root: {
        display: 'flex',
        flexDirection: 'column'
    }
});

const TakePlaceholder: React.FC<any> = (props) => {
    return (
        <Box textAlign="center" pt={3} mb={8}>
            <TakeCardIcon />

            <Box fontSize={18} fontWeight={500} m="0 auto" width={0.5} mt={4}>
                У Вас нет предстоящих записей
            </Box>

            <AppLinkButton to="/profile" floated appColor="linear">
                добавить
            </AppLinkButton>
        </Box>
    );
}

export const Calendar: React.FC<CalendarProps> = (props) => {
    const classes = useStyles();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const visitsList = useServer(GetHospitalByPatient);
    const loading = visitsList.state.fetching;
    const success = !loading && visitsList.state.answer.succeeded;
    const [visits, setVisits] = useState<Visit[]>([]);

    useLayoutEffect(() => {
        visitsList.fetch({ patientId: Number(currentUser?.id) });
    }, []);

    useEffect(() => {
        if (success) {
            setVisits(visitsList?.state?.answer?.data as any);
        }
    }, [success]);

    // сортируем записи по дате
    visits.sort((l, r) => Date.parse(l.date) - Date.parse(r.date));


    return (
        <Layout title="Календарь" domainPage clearScroll>
            <PageLayout className={classes.root}>
                { }
                {!loading &&
                    <Box p="20px">
                        <Box mb={2} fontSize={24} fontWeight={500}>Вы записаны на прием</Box>

                        {
                            (visits.map(
                                (visit) => (
                                    <VisitCard visit={visit} />
                                ))
                            )
                        }
                    </Box>
                }
            </PageLayout>
        </Layout>
    );
};