import react from 'react';
import { makeStyles } from '@material-ui/styles';
import { Paper } from '@material-ui/core';

import './profile.scss';

import { CardLink } from '../../components/UI/CardLink';
import { s } from '../../utils/Styels';
import { PageLayout } from '../../components/UI/PageLayout';

type ProfileProps = {

}

const useStyle = makeStyles({
  root: {
    padding: 5
  }
});

export const Profile: React.FC<ProfileProps> = (props) => {
  const classes = useStyle();

  return (
    <PageLayout>
      <CardLink
        title="Данные"
        subTitle="ваши данные"
        to="/profile/data"
        status="error"
        statusLabel="не все данные указаны"
      />

      <CardLink
        title="Семья"
        subTitle="данные вашей семьи"
        to="/profile/family"
        status="success"
        statusLabel="всё хорошо"
      />
    </PageLayout>
  );
};