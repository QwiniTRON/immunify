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
import { MarkDown } from '../../components/MarkDown';

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

  // запрос деталей по вакцинации
  useEffect(() => {
    fetcher.fetch({
      vaccineId: id as any,
      patientId: currentUser!.id as any
    })
  }, []);

  const loading = fetcher.state.fetching;
  const success = !loading && fetcher.state.answer.succeeded;

  // успешная загрузка деталей вакцинации
  useEffect(() => {
    if (success) {
      setVaccination(fetcher.state.answer.data!);

      fetcher.reload();
    }
  }, [success]);


  // стадии для показа
  let toShow = null;

  if (!loading && vaccination !== undefined) {
    toShow = vaccination.stages.map((stage, index) => {
      let stageMode = stage.revaccination ? 'R' : `V${stage.stage}`;
      let stageStep = stage.revaccination ? 'Ревакцинация' : `${stage.stage} Стадия`;
      let stageDate = new Date(stage.date).toLocaleDateString('ru-RU');

      return (
        <div className={sif({
          [classes.stage]: true,
          [classes.stage__connect]: index > 0
        })} key={index}>

          <div className={sif({ [classes.stageIcon]: true, })}>{stageMode}</div>
          <div className={classes.stageTitle}>{stageStep}</div>
          <div className={classes.stageDate}>{stageDate}</div>

        </div>
      );
    });
  }

  if (!loading && vaccination !== undefined && vaccination.stages.length !== 0) {
    const lastStage = vaccination.stages[vaccination.stages.length - 1];
    const maxStage = Math.max.apply(null, vaccination.totalStages.map(x => x.stage))

    let nextStageValue = 0;

    const revaccinationStage = vaccination.totalStages.find(x => x.revaccination);

    if (lastStage.revaccination && revaccinationStage !== undefined) {
      nextStageValue = revaccinationStage.stage;
    } else if (lastStage.stage + 1 <= maxStage) {
      nextStageValue = lastStage.stage + 1;
    }

    if (revaccinationStage) {
      const resultStage = vaccination.totalStages.find(x => x.stage === nextStageValue)!;

      if (Boolean(toShow)) {
        toShow?.push((
          <div
            key={vaccination.stages.length + 2}
            className={sif({
              [classes.stage]: true,
              [classes.stage__connect]: true
            })}>
            <div
              className={sif({ [classes.stageIcon]: true, [classes.stageIcon__deactive]: true })}
            >
              {`${resultStage.revaccination ? 'R' : `V${resultStage.stage}`}`}
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
    }
  };

  return (
    <Layout title="" BackButtonCustom={<BackButton to="/vaccination" text="Вернуться к вакцинациям" />}>
      <PageLayout>
        <Box p="15px">
          <Box fontSize={24} fontWeight={500}>
            {vaccination?.name}
          </Box>

          <Box marginY={1}>
            <MarkDown md={vaccination?.detailedShort ?? ''} />
          </Box>

          <Box mt={3}>

            {toShow}

          </Box>
        </Box>
      </PageLayout>
    </Layout>
  );
};