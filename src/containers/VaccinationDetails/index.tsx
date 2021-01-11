import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import { BackButton, Layout, PageLayout } from '../../components';
import { sif } from '../../utils';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

type VaccinationDetailsProps = {}

const useStyles = makeStyles({
  stage: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    gap: '0 20px',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 50,
  },

  stageIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#9BC83F',
    color: 'white',
    lineHeight: '35px',
    textAlign: 'center',
    borderRadius: 20,
    border: '4px solid rgba(155, 200, 63, 0.4)',
    backgroundClip: 'padding-box',
    zIndex: 1
  },

  stageTitle: {
    fontSize: 18,
    fontWeight: 300
  },

  stageDate: {
    color: '#777'
  },

  stageIcon__deactive: {
    backgroundColor: '#acacac',
    border: '4px solid rgba(172, 172, 172, 0.5)'
  },

  stageTake: {
    color: 'white',
    fontSize: 14,
    padding: 5,
    borderRadius: 20,
    lineHeight: 1.24
  },

  buttonLink: {
    textDecoration: 'none'
  },

  stage__connect: {
    '&::before': {
      content: '""',
      width: 2,
      zIndex: 0,
      position: 'absolute',
      left: 19,
      bottom: '50%',
      height: 85,
      border: "1px dashed #D7D7D7"
    }
  }
});


export const VaccinationDetails: React.FC<VaccinationDetailsProps> = (props) => {
  const classes = useStyles();


  return (
    <Layout title="" BackButtonCustom={<BackButton to="/vaccination" text="Вернуться к вакцинациям" />}>
      <PageLayout>
        <Box p="15px">
          <Box fontSize={24} fontWeight={500}>
            Гардасил
          </Box>
          <Box fontWeight={300} color="#777">
            Защищает от ВПЧ
          </Box>


          <Box mt={3}>

            <div className={classes.stage}>
              <div className={sif({ [classes.stageIcon]: true, })}>V1</div>
              <div className={classes.stageTitle}>Первая вакцинация</div>
              <div className={classes.stageDate}>07.11.2018</div>
            </div>
            <div
              className={sif({
                [classes.stage]: true,
                [classes.stage__connect]: true
              })}>
              <div className={sif({ [classes.stageIcon]: true, })}>V2</div>
              <div className={classes.stageTitle}>Вторая вакцинация</div>
              <div className={classes.stageDate}>26.04.2019</div>
            </div>
            <div
              className={sif({
                [classes.stage]: true,
                [classes.stage__connect]: true
              })}>
              <div
                className={sif({ [classes.stageIcon]: true, [classes.stageIcon__deactive]: true})}
              >
                V3
              </div>
              <div className={classes.stageTitle}>Третья вакцинация</div>
              <Link className={classes.buttonLink} to="/">
                <Button classes={{ root: classes.stageTake }} variant="contained" color="primary">
                  Записаться
                </Button>
              </Link>
            </div>

          </Box>
        </Box>
      </PageLayout>
    </Layout>
  );
};