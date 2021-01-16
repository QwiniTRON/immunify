import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Layout } from '../../components/Layout/Layout';
import { ReactComponent as ShieldIcon } from '../../assets/shield.svg';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import { DiseasCard } from '../../components/UI/DiseasCard';
import { PageLayout } from '../../components/UI/PageLayout';
import { RootState } from '../../store';
import { UserModel } from '../../models/User';
import { AppLinkButton } from '../../components/UI/AppLinkButton';
import { useServer } from '../../hooks';
import { GetVaccinationByPatient, PatientVaccinations, PatientVaccination, GetVaccines } from '../../server';
import { Vaccination, VaccinationModel, VaccinationStatus } from '../../models/Vaccination';
import { CircleLoader } from '../../components/UI/CircleLoader';
import { AppRadioGroup } from '../../components';
import { sif } from '../../utils';



type PassportProps = {}

type Vaccine = {
    id: number
    name: string
    diseaseIds: number[]
}

export type VaccinationForDiseas = {
    vaccination: PatientVaccination,
    vaccinationStatus: VaccinationStatus,
    diseaseIds: number[]
}


const useStyles = makeStyles({
    stepMenu: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: '1fr',
        gap: '0 15px',
        margin: '14px 0',

        '@supports not (display: grid)': {
            display: 'flex'
        }
    },

    step: {
        backgroundColor: '#FFFFFF',
        boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.2)',
        borderRadius: '2px',
        padding: 8,
        textAlign: 'center',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.3s, color 0.2s',

        "& input": {
            opacity: 0,
            widht: 1,
            height: 1,
            position: 'absolute',
            appearance: 'none',
            left: 0,
            top: 0
        }
    },

    step__active: {
        backgroundColor: '#67CDFD',
        color: 'white'
    }
});


const PassportPlaceholder: React.FC<any> = (props) => {
    return (
        <Box textAlign="center" pt={4} mb={8}>
            <ShieldIcon />

            <Box fontSize={18} fontWeight={500} m="0 auto" width={0.5} mt={4}>
                Недостаточно данных
            </Box>

            <Box m="0 auto" width={0.5} mt={1}>
                Заполните данные о себе, чтобы изучить личный иммунный паспорт
            </Box>

            <AppLinkButton to={`/profile`} appColor="linear" floated>
                Добавить
            </AppLinkButton>
        </Box>
    );
}

export const Passport: React.FC<PassportProps> = (props) => {
    const classes = useStyles();

    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const compleatedStatus = UserModel.getCurrentUserDataStatus();

    const [vaccinations, setVaccinations] = useState<PatientVaccinations>([]);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);

    const [step, setStep] = useState("all");

    const vaccinationsRequest = useServer(GetVaccinationByPatient);
    const vaccinesRequest = useServer(GetVaccines);
    const loading = vaccinationsRequest.state.fetching || vaccinesRequest.state.fetching;
    const vaccinationsRequestSuccess = !vaccinationsRequest.state.fetching && vaccinationsRequest.state.answer.succeeded;
    const vaccinesRequestSuccess = !vaccinesRequest.state.fetching && vaccinesRequest.state.answer.succeeded;

    // запрашиваем вакцинации и вакцины
    useEffect(() => {
        vaccinationsRequest.fetch({
            patientId: Number(currentUser?.id)
        });
        vaccinesRequest.fetch(undefined);
    }, []);

    // вакцинации и болезни, на которые они воздействуют
    const vaccinationsForDiseases = useMemo(() => {
        let resultData: VaccinationForDiseas[] = [];

        // сопоставляем пройденные вакцинации с болезнями на которые они влияют
        if (vaccinations.length > 0 && vaccines.length > 0) {
            resultData = vaccinations.map((vaccination) => {
                const vaccine = vaccines.find(vaccine => vaccine.name == vaccination.name);

                return {
                    vaccination: vaccination,
                    vaccinationStatus: VaccinationModel.getVaccinationStatus(vaccination),
                    diseaseIds: vaccine?.diseaseIds
                } as VaccinationForDiseas;
            });
        }

        return resultData;
    }, [vaccinations, vaccines]);


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

    // отфильтрованные вакцинации для болезней
    const risksFiltred = currentUser?.Risks?.filter((risk) => {
        const riskStatus = Math.max(risk.risk, risk.regionRisk + 1, risk.professionRisk + 1);

        if (step == "high") {
            return riskStatus == 3;
        }
        if (step == "med") {
            return riskStatus == 2;
        }
        if (step == "low") {
            return riskStatus == 1;
        }
        if (step == "all") {
            return true;
        }
    }).sort((l, r) => Math.max(r.risk, r.regionRisk + 1, r.professionRisk + 1) - Math.max(l.risk, l.regionRisk + 1, l.professionRisk + 1));




    return (
        <Layout title="Иммунный пасспорт" domainPage>
            <PageLayout>
                <Box paddingX="15px">

                    {loading &&
                        <Box textAlign="center"><CircleLoader /></Box>
                    }

                    {!compleatedStatus && !loading && <PassportPlaceholder />}

                    {/* {compleatedStatus && !loading &&
                        <>
                            <Box fontSize={24} fontWeight={500}>Риски</Box>

                            <AppRadioGroup value={step} onChange={(value: string) => setStep(value)} className={classes.stepMenu}>
                                <label className={sif({ [classes.step]: true, [classes.step__active]: step == "high" })} >
                                    Высокие
                                    <input type="radio" value="high" name="step" />
                                </label>
                                <label className={sif({ [classes.step]: true, [classes.step__active]: step == "med" })} >
                                    Средние
                                    <input type="radio" value="med" name="step" />
                                </label>
                                <label className={sif({ [classes.step]: true, [classes.step__active]: step == "low" })} >
                                    Низкие
                                    <input type="radio" value="low" name="step" />
                                </label>
                                <label className={sif({ [classes.step]: true, [classes.step__active]: step == "all" })} >
                                    все
                                    <input type="radio" value="all" name="step" />
                                </label>
                            </AppRadioGroup>
                        </>
                    } */}

                    {compleatedStatus && !loading &&
                        <>
                            <Box fontSize={24} fontWeight={500}>
                                {currentUser?.name}
                            </Box>
                            <Box mb={2} color="#999" fontSize={18} fontWeight={300}>
                                Вы ещё не защищены от этих заболеваний
                            </Box>

                            {risksFiltred?.map((risk) => {
                                const foundVaccination = vaccinationsForDiseases.find(
                                    (vaccination) => vaccination.diseaseIds.includes(risk.diseaseId)
                                );

                                return (
                                    <Box key={risk.diseaseId} mb="10px">
                                        <DiseasCard
                                            to={`/passport/${risk.diseaseId}`}
                                            risk={risk}
                                            vaccination={foundVaccination} />
                                    </Box>
                                )
                            })}
                        </>
                    }
                </Box>
            </PageLayout>
        </Layout>
    );
};