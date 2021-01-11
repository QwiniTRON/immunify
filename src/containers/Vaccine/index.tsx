import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { Divider } from '@material-ui/core';

import { AppButtonGroup } from '../../components/UI/ButtonGroup';
import { AppButton } from '../../components/UI/AppButton';
import { Layout } from '../../components/Layout/Layout';
import { PageLayout } from '../../components/UI/PageLayout';
import { BackButton } from '../../components/BackButton';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { useServer } from '../../hooks/useServer';
import { AppLinkButton } from '../../components/UI/AppLinkButton';



type VaccineRouteParams = {
  id: string
}

type VaccineProps = {}

const useStyles = makeStyles({
  linkButton: {
    textDecoration: 'none'
  },

  menuButton: {
    display: 'block',
    fontSize: 14,

    '& svg': {
      fontSize: 32
    }
  },
});

export const Vaccine: React.FC<VaccineProps> = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const vaccine = useLocation<{ id: string, name: string }>().state;


  /**
  * обработка клика кнопки "я привит"
  */
  const takeHandle = () => {
    history.push('/vaccination/add', vaccine);
  }


  return (
    <Layout title="" BackButtonCustom={<BackButton simpleBack text="Вернуться к заболеванию" />}>
      <PageLayout>

        {!vaccine &&
          <Box>
            такая вацина не нашлась

            <Box><Link to="/passport">имунный паспорт</Link></Box>
          </Box>
        }

        {vaccine &&
          <Box fontSize={18}>
            <Box mb={2} display="grid" justifyContent="space-between" gridAutoFlow="column" alignItems="center">
              <Box fontWeight={500} fontSize={24} color="#9BC83F">
                {vaccine.name}
              </Box>

              <IconButton
                classes={{ label: classes.menuButton }}
                onClick={takeHandle}
                color="primary"
              >
                <AddIcon />
                <div>Уже привит</div>
              </IconButton>
            </Box>

            <Box mb={2}>
              Mark down
            </Box>

            <Box mt={3}>
              <Box fontWeight={500}>Последняя вакцинация:</Box>
              <Box>Апрель 2019 - ревакцинация</Box>
            </Box>
          </Box>
        }


        <AppLinkButton to={
          { pathname: '/passport/take', state: { type: 'vaccine', data: vaccine } }
        } className={classes.linkButton}
          disabled={!Boolean(vaccine)}
          floated>
          Записаться
        </AppLinkButton>

      </PageLayout>
    </Layout >
  );
};