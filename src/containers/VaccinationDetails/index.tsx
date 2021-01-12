import React, { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import { BackButton, Layout, PageLayout } from '../../components';
import { sif } from '../../utils';
import Button from '@material-ui/core/Button';
import { Link, useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

import { useServer } from '../../hooks/useServer';
import { DetailedVaccinationType, GetDetailedVaccination } from '../../server';

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

type DiseasRoutParams = {
  id: string
}

export const VaccinationDetails: React.FC<VaccinationDetailsProps> = (props) => {
  const classes = useStyles();
  const [vaccination, setVaccination] = useState<DetailedVaccinationType>();

  const id = useRouteMatch<DiseasRoutParams>().params.id;  
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const fetcher = useServer(GetDetailedVaccination);

  useEffect(() => {
    fetcher.fetch({
      vaccineId: id as any,
      patientId: currentUser!.id as any
    })
  }, []);

  const loading = fetcher.state.fetching;
  const success = !loading && fetcher.state.answer.succeeded;

  useEffect(() => {
    if (success) {
      setVaccination(fetcher.state.answer.data!);

      fetcher.reload();
    }
  }, [success]);

  const toShow = !loading && vaccination !== undefined && vaccination.stages.map((stage, index) => {
    return (
      <div className={classes.stage} key={index}>
        <div className={sif({ [classes.stageIcon]: true, })}>{`${stage.revaccination ? 'R' : 'V'}${stage.stage}`}</div>
        <div className={classes.stageTitle}>{`${stage.revaccination ? 'Ревакцинация' : `${stage.stage} Стадия`}`}</div>
        <div className={classes.stageDate}>{new Date(stage.date).toLocaleDateString('ru-RU')}</div>
      </div>
    );
  });

  !loading && vaccination !== undefined && vaccination.stages.length !== 0 && function() {
    const lastStage = vaccination.stages[vaccination.stages.length - 1];
    const maxStage = Math.max.apply(null, vaccination.totalStages.map(x => x.stage))
    
    let nextStageValue = 0;

    const minRevaccinationStage = Math.min.apply(null, vaccination.totalStages.filter(x => x.revaccination).map(x => x.stage));

    if (lastStage.revaccination) {
      nextStageValue = lastStage.stage + 1 > maxStage ? minRevaccinationStage : lastStage.stage + 1;
    } else {
      nextStageValue = lastStage.stage + 1 > maxStage ? 1 : lastStage.stage + 1;
    }

    const resultStage = vaccination.totalStages.find(x => x.stage === nextStageValue)!;

    if (toShow !== false) {
      toShow.push((
        <div
          key={vaccination.stages.length + 2}
          className={sif({
            [classes.stage]: true,
            [classes.stage__connect]: true
          })}>
          <div
            className={sif({ [classes.stageIcon]: true, [classes.stageIcon__deactive]: true})}
          >
            {`${resultStage.revaccination ? 'R' : 'V'}${resultStage.stage}`}
          </div>
          <div className={classes.stageTitle}>{`${resultStage.revaccination ? 'Ревакцинация' : `${resultStage.stage} Стадия`}`}</div>
          <Link className={classes.buttonLink} to="/passport/take">
            <Button classes={{ root: classes.stageTake }} variant="contained" color="primary">
              Записаться
            </Button>
          </Link>
        </div>
      ));
    }
  }();
  
  return (
    <Layout title="" BackButtonCustom={<BackButton to="/vaccination" text="Вернуться к вакцинациям" />}>
      <PageLayout>
        <Box p="15px">
          <Box fontSize={24} fontWeight={500}>
            {vaccination?.name}
          </Box>
          <Box fontWeight={300} color="#777">
            {vaccination?.detailedShort}
          </Box>


          <Box mt={3}>

            {toShow}
            
          </Box>
        </Box>
      </PageLayout>
    </Layout>
  );
};