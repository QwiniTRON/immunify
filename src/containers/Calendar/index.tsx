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
import { CircleLoader } from '../../components/UI/CircleLoader';

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
    },

    takeButton: {
        maxWidth: 160,
        width: "100%",
        marginBottom: 20
    }
});

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
        <Layout title="Предстоящие записи" domainPage clearScroll>
            <PageLayout className={classes.root}>
                {loading &&
                    <Box textAlign="center"><CircleLoader /></Box>
                }

                {
                    !loading && visits.length == 0 &&
                    <TakePlaceholder />
                }

                {!loading && visits.length > 0 &&
                    <Box p="10px 20px">
                        <Box mb={2} fontSize={24} fontWeight={500}>Вы записаны на прием</Box>

                        {
                            (visits.map(
                                (visit, idx) => (
                                    <Box marginY={2} key={idx}>
                                        <VisitCard visit={visit} />
                                    </Box>
                                ))
                            )
                        }
                    </Box>
                }

                <Box mt="auto" textAlign="center">
                    <AppLinkButton
                        disabled={loading}
                        to={{
                            pathname: `/passport/take`
                        }}
                        appColor="linear"
                        className={classes.takeButton}
                    > Записаться
                    </AppLinkButton>
                </Box>
            </PageLayout>
        </Layout>
    );
};