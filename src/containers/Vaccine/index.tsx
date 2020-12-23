import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { AppButtonGroup } from '../../components/UI/ButtonGroup';
import { AppButton } from '../../components/UI/AppButton';
import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';


type VaccineProps = {}

const useStyles = makeStyles({
  divider: {
    height: 1,
    backgroundColor: '#E0F0BE',
    margin: '10px 0'
  }
});

export const Vaccine: React.FC<VaccineProps> = (props) => {
  const clasess = useStyles();

  return (
    <Layout title="">
      <PageLayout>
        <Box fontSize={18}>
          <Box fontWeight={500} fontSize={24}><h2>Гардасил</h2></Box>

          <div className={clasess.divider}></div>

          <Box>
            <Box fontWeight={500}>Что это:</Box>
            <Box>Вакцина против ВПЧ</Box>
          </Box>

          <Box mt={3}>
            <Box fontWeight={500}>Кому показано:</Box>
            <Box>М и Ж в детородном возрасте</Box>
          </Box>

          <Box mt={3}>
            <Box fontWeight={500}>Противопоказания: </Box>
            <Box>Фимоз головного мозга</Box>
          </Box>

          <Box mt={3}>
            <Box fontWeight={500}>Последняя вакцинация:</Box>
            <Box>Апрель 2019 - ревакцинация</Box>
          </Box>
        </Box>


        <AppButtonGroup floated>
          <AppButton appColor="white">Я уже прививался</AppButton>
          <AppButton>Записаться</AppButton>
        </AppButtonGroup>
      </PageLayout>
    </Layout>
  );
};