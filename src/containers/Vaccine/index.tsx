import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import { AppButtonGroup } from '../../components/UI/ButtonGroup';
import { AppButton } from '../../components/UI/AppButton';
import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';
import { Divider } from '@material-ui/core';
import { BackButton } from '../../components/BackButton';
import { Link, useLocation, useRouteMatch } from 'react-router-dom';
import { useServer } from '../../hooks/useServer';



type VaccineRouteParams = {
  id: string
}

type VaccineProps = {}

const useStyles = makeStyles({
  linkButton: {
    textDecoration: 'none'
  }
});

export const Vaccine: React.FC<VaccineProps> = (props) => {
  const clases = useStyles();
  const vaccine = useLocation<{ id: string, name: string }>().state;

  // const vaccineReq = useServer();


  return (
    <Layout title="" BackButtonCustom={<BackButton simpleBack text="Вернуться к заболеванию" />}>
      <PageLayout>

        {!vaccine &&
          <Box>
            такая вацина не нашлась
        </Box>
        }
        {vaccine && <Box fontSize={18}>
          <Box fontWeight={500} fontSize={24}><h2>{vaccine.name}</h2></Box>

          <Divider />

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
        }




        <AppButtonGroup floated>
          { Boolean(vaccine) && 
            <Link to={{ pathname: "/vaccination/add", state: vaccine }} className={clases.linkButton}>
            <AppButton appColor="white">Я уже прививался</AppButton>
          </Link>
          }

          {vaccine &&
            <Link to={
              { pathname: '/passport/take', state: { type: 'vaccine', data: vaccine } }
            } className={clases.linkButton}>
              <AppButton>Записаться</AppButton>
            </Link>
          }
        </AppButtonGroup>
      </PageLayout>
    </Layout>
  );
};