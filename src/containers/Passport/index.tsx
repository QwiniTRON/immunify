import React from 'react';
import { useSelector } from 'react-redux';
import { Layout } from '../../components/Layout/Layout';
import { ReactComponent as ShieldIcon } from '../../assets/shield.svg';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';

import { DiseasCard } from '../../components/UI/DiseasCard';
import { PageLayout } from '../../components/UI/PageLayout';
import { RootState } from '../../store';
import { UserModel } from '../../models/User';
import { AppButton } from '../../components/UI/AppButton';



type PassportProps = {

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

            <Link to={`/profile`}>
                <AppButton appColor="linear" floated>
                    Добавить
                </AppButton>
            </Link>
        </Box>
    );
}

export const Passport: React.FC<PassportProps> = (props) => {
    const currentUser = useSelector((state: RootState) => state.user.currentUser);
    const compleatedStatus = UserModel.getCurrentUserDataStatus();

    return (
        <Layout title="Иммунный пасспорт" titleCurrentName domainPage>
            <PageLayout>
                <Box paddingX={1}>
                    {!compleatedStatus && <PassportPlaceholder />}


                    {compleatedStatus &&
                        <>
                            <Box fontSize={18}>Вы ещё не защищены от этих заболеваний</Box>
                            {currentUser?.Risks.map((risk) => (
                                <Box key={risk.diseaseId} marginY={2}>
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