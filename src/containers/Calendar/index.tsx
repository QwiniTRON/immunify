import React, { useState } from 'react';
import { Layout } from '../../components/Layout/Layout';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { PageLayout } from '../../components/UI/PageLayout';
import { InfoCard } from '../../components/UI/InfoCard';
import { AppTabPanel } from '../../components/UI/TabPanel';
import { Link } from 'react-router-dom';
import { AppButtonGroup } from '../../components/UI/ButtonGroup';
import { AppButton } from '../../components/UI/AppButton';



type CalendarProps = {

}

const useStyles = makeStyles({
    content: {
        flexGrow: 1,
        overflow: 'auto',
        flexBasis: 1
    },
    root: {
        display: 'flex',
        flexDirection: 'column'
    }
});

export const Calendar: React.FC<CalendarProps> = (props) => {
    const [tabValue, setTabValue] = useState(0);
    const clasess = useStyles();

    const handleTabChange = (event: any, newValue: any) => {
        setTabValue(newValue);
    };

    return (
        <Layout title="Календарь" domainPage clearScroll>
            <PageLayout className={clasess.root}>

                <Box mb={1}>
                    <Tabs variant="fullWidth" indicatorColor="primary" value={tabValue} onChange={handleTabChange} aria-label="simple tabs example">
                        <Tab label="Календарь" textColor="#000" />
                        <Tab label="Список" textColor="#000" />
                    </Tabs>
                </Box>

                <AppTabPanel value={tabValue} index={0}>
                    Item One
                </AppTabPanel>
                <AppTabPanel value={tabValue} index={1} className={clasess.content}>
                    <Box component="h2" fontSize={24}>Вы записаны на прием</Box>

                    <Box marginY={1}>
                        <InfoCard data={[
                            { description: '11:00', title: '30 октября 2020' },
                            { description: 'Москва, улица Перерва, дом 53', title: 'Клинико-диагностический центр МЕДСИ (Марьино)' },
                            { description: 'Инфарникс', title: 'Вакцина' },
                        ]}
                            detailText="Детали"
                            to=""
                        />
                    </Box>
                    <Box marginY={1}>
                        <InfoCard data={[
                            { description: '11:00', title: '30 октября 2020' },
                            { description: 'Москва, улица Перерва, дом 53', title: 'Клинико-диагностический центр МЕДСИ (Марьино)' },
                            { description: 'Инфарникс', title: 'Вакцина' },
                        ]}
                            detailText="Детали"
                            to=""
                        />
                    </Box>
                    <Box marginY={1}>
                        <InfoCard data={[
                            { description: '11:00', title: '30 октября 2020' },
                            { description: 'Москва, улица Перерва, дом 53', title: 'Клинико-диагностический центр МЕДСИ (Марьино)' },
                            { description: 'Инфарникс', title: 'Вакцина' },
                        ]}
                            detailText="Детали"
                            to=""
                        />
                    </Box>

                    <Link to="/"><Box color="#333" textAlign="center" margin={'10px auto'} width={0.8}>Добавьте события в календарь, чтобы не забыть об этом</Box></Link>
                </AppTabPanel>

                <AppButtonGroup floated>
                    <AppButton appColor="white">
                        Отменить
                    </AppButton>
                    <AppButton>
                        Я привит
                    </AppButton>
                </AppButtonGroup>
            </PageLayout>
        </Layout>
    );
};