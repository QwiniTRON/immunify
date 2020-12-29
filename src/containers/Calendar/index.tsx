import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { ReactComponent as TakeCardIcon } from '../../assets/takeCard.svg';

import { PageLayout } from '../../components/UI/PageLayout';
import { InfoCard } from '../../components/UI/InfoCard';
import { AppTabPanel } from '../../components/UI/TabPanel';
import { Link } from 'react-router-dom';
import { AppButtonGroup } from '../../components/UI/ButtonGroup';
import { AppButton } from '../../components/UI/AppButton';
import { useSelector } from 'react-redux';
import { useServer } from '../../hooks/useServer';
import { GetHospitalByPatient } from '../../server/fetchers/hospitalVisit';
import { RootState } from '../../store';
import { Loader } from '../../components';
import { AppLinkButton } from '../../components/UI/AppLinkButton';

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
    content: {
        flexGrow: 1,
        overflow: 'auto',
        flexBasis: 1,
        paddingBottom: 60
    },

    root: {
        display: 'flex',
        flexDirection: 'column'
    },

    linkButton: {
        textDecoration: 'none'
    },

    expiredVisit: {
        backgroundColor: '#eee'
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

    const [tabValue, setTabValue] = useState(0);

    useLayoutEffect(() => {
        visitsList.fetch({ patientId: Number(currentUser?.id) });
    }, []);

    useEffect(() => {
        if (success) {
            setVisits(visitsList?.state?.answer?.data as any);
            visitsList.reload();
        }
    }, [success]);

    const handleTabChange = (event: any, newValue: any) => {
        setTabValue(newValue);
    };

    if (!loading && visits.length === 0 && visitsList.state.answer.succeeded == true) {
        return <TakePlaceholder />
    }

    // сортируем записи по дате
    visits.sort((l, r) => Date.parse(l.date) - Date.parse(r.date));


    return (
        <Layout title="Календарь" domainPage clearScroll>
            <PageLayout className={classes.root}>

                <Box mb={1}>
                    <Tabs variant="fullWidth" indicatorColor="primary" value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                        <Tab label="Список" textColor="#000" />
                        <Tab label="Календарь" textColor="#000" />
                    </Tabs>
                </Box>

                <AppTabPanel value={tabValue} index={0} className={classes.content}>
                    <Box p={1}>
                        <Box component="h2" fontSize={24}>Вы записаны на прием</Box>

                        {loading && <Loader />}

                        {!loading && visits.map((v) => {
                            const isExpired = (Date.parse(v.date) - Date.now()) < 0;

                            return (
                                <Box marginY={1} key={v.id}>
                                    <InfoCard data={[
                                        {
                                            description: new Date(v.date).toLocaleString('ru', {
                                                hour: '2-digit', minute: '2-digit',
                                                day: '2-digit', year: 'numeric', month: 'short'
                                            }),
                                            title: v.hospital.name
                                        }
                                    ]}
                                        detailText="Детали"
                                        to={`/calendar/${v.id}`}
                                        classes={{
                                            root: isExpired ? classes.expiredVisit : ''
                                        }}
                                    />
                                </Box>
                            )
                        })}

                        <Link to={`/`}><Box color="#333" textAlign="center" margin={'10px auto'} width={0.8}>Добавьте события в календарь, чтобы не забыть об этом</Box></Link>
                    </Box>
                </AppTabPanel>

                <AppTabPanel value={tabValue} index={1}>
                    <Box textAlign="center">
                        <EventAvailableIcon />
                    </Box>
                </AppTabPanel>

                <AppButtonGroup floated>
                    <AppButton appColor="white">
                        Отменить
                    </AppButton>
                    <AppLinkButton className={classes.linkButton} to={`/vaccination/add`}>
                        Я привит
                    </AppLinkButton>
                </AppButtonGroup>
            </PageLayout>
        </Layout>
    );
};