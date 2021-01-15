import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Layout } from '../../components/Layout/Layout';
import { ReactComponent as ShieldIcon } from '../../assets/shield.svg';
import Box from '@material-ui/core/Box';

import { DiseasCard } from '../../components/UI/DiseasCard';
import { PageLayout } from '../../components/UI/PageLayout';
import { RootState } from '../../store';
import { UserModel } from '../../models/User';
import { AppLinkButton } from '../../components/UI/AppLinkButton';
import { useServer } from '../../hooks';
import { GetVaccinationByPatient, PatientVaccinations, PatientVaccination , GetVaccines } from '../../server';
import { Vaccination, VaccinationModel, VaccinationStatus } from '../../models/Vaccination';



type PassportProps = {}

type Vaccine = {
    id: number
    name: string
    diseaseIds: number[]
}

type VaccinationForDiseas = {
    vaccination: PatientVaccination,
    vaccinationStatus: VaccinationStatus,
    diseaseIds: number[]
}


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
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const compleatedStatus = UserModel.getCurrentUserDataStatus();

    const [vaccinations, setVaccinations] = useState<PatientVaccinations>([]);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);


    const vaccinationsRequest = useServer(GetVaccinationByPatient);
    const vaccinesRequest = useServer(GetVaccines);
    const loading = vaccinationsRequest.state.fetching || vaccinesRequest.state.fetching;
    const vaccinationsRequestSuccess = !vaccinationsRequest.state.fetching && vaccinationsRequest.state.answer.succeeded;
    const vaccinesRequestSuccess = !vaccinesRequest.state.fetching && vaccinesRequest.state.answer.succeeded;

    useEffect(() => {
        vaccinationsRequest.fetch({
            patientId: Number(currentUser?.id)
        });
        vaccinesRequest.fetch(undefined);
    }, []);

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


    if (vaccinationsRequestSuccess) {
        const userVaccinations = vaccinationsRequest.state.answer.data as PatientVaccinations;
        setVaccinations(userVaccinations);
        vaccinationsRequest.reload();
    }

    if (vaccinesRequestSuccess) {
        setVaccines(vaccinesRequest.state.answer.data as Vaccine[]);
        vaccinesRequest.reload();
    }
    

    return (
        <Layout title="Иммунный пасспорт" titleCurrentName domainPage>
            <PageLayout>
                <Box paddingX="15px">
                    {!compleatedStatus && <PassportPlaceholder />}


                    {compleatedStatus &&
                        <>
                            <Box fontSize={24} fontWeight={500} component="h1" >
                                {currentUser?.name}
                            </Box>

                            <Box fontSize={14} color="#777" mb={2}>Вы ещё не защищены от этих заболеваний</Box>

                            {currentUser?.Risks.map((risk) => (
                                <Box key={risk.diseaseId} mb="10px">
                                    <DiseasCard
                                        to={`/passport/${risk.diseaseId}`}
                                        name={risk.disease}
                                        risks={[risk.risk, risk.professionRisk, risk.regionRisk]} />
                                </Box>
                            ))}
                        </>
                    }
                </Box>
            </PageLayout>
        </Layout>
    );
};