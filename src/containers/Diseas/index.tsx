import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import './diseas.scss';

import { PageLayout } from '../../components/UI/PageLayout';
import { Layout } from '../../components/Layout/Layout';
import { BackButton } from '../../components/BackButton';
import { useServer } from '../../hooks/useServer';
import { GetDetailedDisease } from '../../server';
import { AppLinkButton } from '../../components/UI/AppLinkButton';
import { CircleLoader, CircleLoaderColors } from '../../components/UI/CircleLoader';
import { MarkDown } from '../../components/MarkDown';
import { GetVaccinationByPatient, PatientVaccinations, GetVaccines } from '../../server';
import { VaccinationModel, VaccinationStatus } from '../../models/Vaccination';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AppButtonGroup, Divider, SubMenuContainer } from '../../components';
import { s } from '../../utils';


//#region types
type DiseasRoutParams = {
    id: string
}

type DiseasProps = {

}

type Vaccine = {
    id: number
    name: string
    diseaseIds: number[]
}

type Diseas = {
    id: number,
    name: string,
    detailedShort: string,
    detailedFull: string,
    vaccines: Vaccine[],
}

type CorrectVaccinationData = {
    vaccine: Vaccine
    vaccination: {
        id: number
        name: string
        detailed: string
        passedStages: {
            revaccination: boolean
            stage: number
            date: string
            durationStartInMonths: number
            durationEndInMonths: number
        }[]
        totalStages: number[]
    }
    vaccineStatus: VaccinationStatus
}
//#endregion

//#region styles
const useStyles = makeStyles((theme) => ({
    title: {
        fontSize: 24,
        fontWeight: 500,
        margin: '10px 0',
        color: '#67CDFD'
    },

    menuButton: {
        display: 'block',
        fontSize: 14,

        '& svg': {
            fontSize: 32
        }
    },

    vaccineLink: {
        color: '#000',
        fontSize: 18,
        fontWeight: 400
    },

    takeButton: {
        maxWidth: 160,
        width: "100%"
    },

    vaccinedNotice: {
        color: '#67CDFD',
        border: '1px solid #67CDFD',
        padding: 5,
        borderRadius: 2,
        textAlign: 'center'
    },

    risks: {
        fontSize: 18,
        marginBottom: 35
    },

    line: {
        display: 'flex',
        alignItems: 'center',
        gap: '0 15px',

        '@media (max-width: 354px)': {
            fontSize: 16
        }
    },

    subTitle: {
        color: '#acacac',
        fontWeight: 300,
        fontSize: 18
    },

    indicator: {
        height: 12,
        width: 12,
        borderRadius: 6,
        margin: 7
    },

    lineTitle: {
        display: 'flex',
        alignItems: 'center',
        wordBreak: 'break-all',
        color: '#acacac',
        fontWeight: 300,

        '@media (max-width: 354px)': {
            fontSize: 16
        }
    },

    vaccineLine: {
        display: 'flex',
        gap: '0 15px',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    green: {
        backgroundColor: '#3BCF1A',
    },

    yellow: {
        backgroundColor: '#FFB800',
    },

    red: {
        backgroundColor: '#FF003D',
    }
}));
//#endregion

//#region enums
const StepEnum: { [p: string]: number } = {
    'red': 3,
    'yellow': 2,
    'green': 1
}
const ColorsEnum: { [p: string]: string } = {
    '1': 'green',
    '2': 'yellow',
    '3': 'red',
    '4': 'green'
}
const TextsEnum: { [p: string]: string } = {
    '1': 'низкий',
    '2': 'средний',
    '3': 'высокий',
    '4': 'минимальный'
}

type RiskTableProps = {
    personRisk?: string
    professionalRisk: string
    regionalRisk: string
}
//#endregion

//#region risktable
const RiskTable: React.FC<RiskTableProps> = ({
    personRisk = '4',
    professionalRisk,
    regionalRisk
}) => {
    const classes = useStyles();

    return (
        <div className={classes.risks}>
            <Box fontWeight={500} mb={2}>Мои риски заражения: </Box>

            <div className={classes.line}>
                <div className={classes.lineTitle}>
                    <div className={s(classes.indicator, (classes as any)[ColorsEnum[personRisk]])} />
                    Индивидуальный
                </div>

                <Box ml="auto">
                    {TextsEnum[personRisk]}
                </Box>
            </div>

            <Divider color="gray" />
            <div className={classes.line}>
                <div className={classes.lineTitle}>
                    <div className={s(classes.indicator, (classes as any)[ColorsEnum[professionalRisk]])} />
                    Профессиональный
                </div>

                <Box ml="auto">
                    {TextsEnum[professionalRisk]}
                </Box>
            </div>

            <Divider color="gray" />
            <div className={classes.line}>
                <div className={classes.lineTitle}>
                    <div className={s(classes.indicator, (classes as any)[ColorsEnum[regionalRisk]])} />
                    Эпидемиологический
                </div>

                <Box ml="auto">
                    {TextsEnum[regionalRisk]}
                </Box>
            </div>
        </div>
    );
}
//#endregion


export const Diseas: React.FC<DiseasProps> = (props) => {
    const classes = useStyles();
    const history = useHistory();
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const diseasId = useRouteMatch<DiseasRoutParams>().params.id;

    const currentRisk = currentUser?.Risks.find((risk) => risk.diseaseId == Number(diseasId));

    const [vaccinations, setVaccinations] = useState<PatientVaccinations>([]);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [diseas, setDiseas] = useState<Diseas | null>(null);

    // запросы
    const diseasReq = useServer(GetDetailedDisease);
    const vaccinationsRequest = useServer(GetVaccinationByPatient);
    const vaccinesRequest = useServer(GetVaccines);

    // статусы
    const loading = vaccinationsRequest.state.fetching || vaccinesRequest.state.fetching || diseasReq.state.fetching;
    const success = !diseasReq.state.fetching && diseasReq.state.answer.succeeded;
    const vaccinationsRequestSuccess = !vaccinationsRequest.state.fetching && vaccinationsRequest.state.answer.succeeded;
    const vaccinesRequestSuccess = !vaccinesRequest.state.fetching && vaccinesRequest.state.answer.succeeded;

    // загрузка информации по болезни
    useEffect(() => {
        diseasReq.fetch({ diseaseId: Number(diseasId) });
    }, []);

    // успешная загрузка данных болезни
    useEffect(() => {
        if (success && diseasReq.state.answer?.data !== undefined) {
            setDiseas(diseasReq.state.answer.data as any);
        }
    }, [success]);

    // запрашиваем вакцинации и вакцины
    useEffect(() => {
        vaccinationsRequest.fetch({
            patientId: Number(currentUser?.id)
        });
        vaccinesRequest.fetch(undefined);
    }, []);

    /**
     * обработка клика кнопки "я привит"
     */
    const takeHandle = () => {
        history.push('/vaccination/add', { type: 'diseas', data: diseas });
    }

    // пришли вакцинации для пациента
    if (vaccinationsRequestSuccess) {
        const userVaccinations = vaccinationsRequest.state.answer.data as PatientVaccinations;
        setVaccinations(userVaccinations);
        vaccinationsRequest.reload();
    }

    // пришли вакцины
    if (vaccinesRequestSuccess) {
        setVaccines(vaccinesRequest.state.answer.data as Vaccine[]);
        vaccinesRequest.reload();
    }

    // вакцины пройденные пациентом
    let correctVaccines: CorrectVaccinationData[] = getCorrectVaccinations(vaccines, vaccinations, Number(diseasId));

    // самая последняя из пройденных вакцин
    let newestVaccine = getNewestCorrectVaccination(correctVaccines);

    const isVaccined = Boolean(newestVaccine);
    const personRisk = currentRisk?.risk ? String(currentRisk?.risk) : undefined;
    const professionalRisk = String((currentRisk?.professionRisk ?? 0) + 1);
    const regionalRisk = String((currentRisk?.regionRisk ?? 0) + 1);


    // если данных по болезни не нашлось
    if (!loading && !success) return (
        <Layout title="" BackButtonCustom={<BackButton text="Вернуться к иммунному паспорту" />}>
            <PageLayout className="diseas-page">
                <h3 className={classes.title}>Такой болезни не нашлось</h3>
                <Link to={`/profile`} >в профиль</Link>
            </PageLayout>
        </Layout>
    );


    // кнопка записатся
    const subMenu =
        (
            <SubMenuContainer>
                <AppLinkButton
                    minWidth
                    disabled={loading}
                    to={{
                        pathname: `/passport/take`,
                        state: { type: 'diseas', data: diseas }
                    }}
                > Записаться</AppLinkButton>
            </SubMenuContainer>
        );

    return (
        <Layout
            title=""
            BackButtonCustom={<BackButton text="Вернуться к иммунному паспорту" />}
            toolMenu={subMenu}>
            <PageLayout className="diseas-page">

                {loading && <Box textAlign="center"><CircleLoader color={CircleLoaderColors.linear} /></Box>}

                {/* название и отметка */}
                {!loading &&
                    <Box mb={2}>
                        <Box mb={5} display="grid" justifyContent="space-between" gridGap="0 10px" gridAutoFlow="column" alignItems="center">
                            <Box component="h3" className={classes.title}>
                                {diseas?.name}
                            </Box>

                            {isVaccined &&
                                <div className={classes.vaccinedNotice}>Я привит</div>
                            }

                            {/* переход на readyPage */}
                            {!isVaccined &&
                                <IconButton
                                    classes={{ label: classes.menuButton }}
                                    disabled={loading}
                                    onClick={takeHandle}
                                    color="primary"
                                >
                                    <AddIcon />
                                    <div>Я привит</div>
                                </IconButton>
                            }
                        </Box>

                        {/* блок с расчётами */}
                        <Box mb={5}>

                            {/* таблица рисков */}
                            <RiskTable key='risktable' personRisk={personRisk} professionalRisk={professionalRisk} regionalRisk={regionalRisk} />

                            {/* строка вакцины */}
                            {isVaccined &&
                                <div className={classes.vaccineLine}>
                                    <div>
                                        <div className={classes.subTitle}>Защита: </div>

                                        <Link
                                            className={classes.vaccineLink}
                                            to={{
                                                pathname: `/passport/vaccine/${newestVaccine.vaccine.id}`,
                                                state: newestVaccine.vaccine
                                            }}
                                        >
                                            {newestVaccine.vaccine.name}
                                        </Link>
                                    </div>

                                    <div>
                                        <div className={classes.subTitle}>Срок действия: </div>

                                        {newestVaccine.vaccineStatus.isEternal &&
                                            <Box fontSize={18} color="#3BCF1A">пожизненная</Box>
                                        }

                                        {!newestVaccine.vaccineStatus.isEternal &&
                                            <div className={classes.subTitle}>
                                                до {new Date(newestVaccine.vaccineStatus.date).toLocaleDateString('ru')}
                                            </div>
                                        }
                                    </div>
                                </div>
                            }

                        </Box>

                        {/* текст */}
                        <Box mb={2}>
                            <MarkDown md={diseas?.detailedFull ?? ""} />
                        </Box>

                        {/* список вакцин */}
                        <Box>
                            <Box fontSize={18} fontWeight={300}>Вакцины:</Box>
                            {
                                diseas?.vaccines.map((vaccine) => (
                                    <Box key={vaccine.id} m={1}>
                                        <Link
                                            className={classes.vaccineLink}
                                            to={{
                                                pathname: `/passport/vaccine/${vaccine.id}`,
                                                state: vaccine
                                            }}
                                        >
                                            {vaccine.name}
                                        </Link>
                                    </Box>
                                ))
                            }
                        </Box>
                    </Box>
                }
            </PageLayout>
        </Layout>
    );
};


/**
 * вакцины пройденные пациентом
 * 
 * @param {Vaccine[]} vaccines все вакцины
 * @param {PatientVaccinations} vaccinations пройденные вакцинации
 * @param {number} diseasId id болезни
 */
function getCorrectVaccinations(vaccines: Vaccine[], vaccinations: PatientVaccinations, diseasId: number) {
    const resultVaccinatoins = [];

    for (const vaccine of vaccines) {
        const foundVaccination = vaccinations.find((vaccination) => vaccination.name == vaccine.name);

        if (foundVaccination && vaccine.diseaseIds.includes(Number(diseasId))) resultVaccinatoins.push({
            vaccine,
            vaccination: foundVaccination,
            vaccineStatus: VaccinationModel.getVaccinationStatus(foundVaccination)
        });
    }

    return resultVaccinatoins;
}

/**
 * получение самой крайней вакцинации
 * 
 * @param {CorrectVaccinationData[]} correctVaccines корректные вакцинации
 */
function getNewestCorrectVaccination(correctVaccines: CorrectVaccinationData[]) {
    return correctVaccines.concat().sort((l, r) =>
        StepEnum[r.vaccineStatus.statusColor as string] - StepEnum[r.vaccineStatus.statusColor as string]
    )[0];
}

