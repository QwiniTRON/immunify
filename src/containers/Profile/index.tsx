import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import './profile.scss';

import { RootState } from '../../store';
import { s } from '../../utils/Styels';
import { PageLayout } from '../../components/UI/PageLayout';
import { Link } from 'react-router-dom';
import { AppButton } from '../../components/UI/AppButton';
import { UserCard } from '../../components/UI/UserCard';
import { UserData } from '../UserData';
import { Layout } from '../../components/Layout/Layout';
import { BackButton } from '../../components/BackButton';
import { CardLink } from '../../components/UI/CardLink';
import { useCheckUserDataCompoeated } from '../../hooks';

type ProfileProps = {

}

const useStyle = makeStyles({
  root: {
    padding: 5
  }
});

export const Profile: React.FC<ProfileProps> = (props) => {
  const classes = useStyle();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const user = useSelector((state: RootState) => state.user.user);
  const idUserDataCompleate = useCheckUserDataCompoeated();

  let dataStatus: "error" | "success" | undefined = "error";
  let dataText = "не все данные указаны";
  if (idUserDataCompleate) {
    dataStatus = "success";
    dataText = 'всё хорошо';
  };

  return (
    <Layout title="Профиль">
      <PageLayout className="profile-page">

        {user?.family.length == 0 ?
          <UserData /> :
          (
            <>
              <p className="family-page__description">Введите данные о членах вашей семьи, чтобы застраховать их от возможных осложнений</p>
              {
                dataStatus == 'error' ? <CardLink
                  title="Заполнить данные"
                  subTitle="Для выбранного пациента введены не все данные"
                  to={`/profile/${currentUser?.name}`}
                  Icon={<AccountBoxIcon color="primary" fontSize="large" />}
                /> :
                  <Box>С данными всё в порядке</Box>
              }

              <Box fontSize={18} p={1}>Список пациентов:</Box>
              <UserCard
                active={user == currentUser}
                progress={10}
                title={String(user?.name)}
                subtitle={String(user?.age! / 60 / 60 / 24 / 365)}
                to={`/profile/${user?.name}`}
                avatarLetters={String(user?.name)[0]} />

              {user?.family.map((u) => {
                let age = u.age;
                // let age = u.age / 60 / 60 / 24 / 365;

                return (
                  <UserCard
                    key={u.name}
                    active={u == currentUser}
                    progress={10}
                    title={String(u?.name)}
                    subtitle={String(age)}
                    to={`/profile/${u?.name}`}
                    avatarLetters={String(u?.name)[0]} />
                )
              })}

            </>
          )
        }


        <Link to="/family/add"><AppButton floated className="family-page__add">добавить</AppButton></Link>

      </PageLayout>
    </Layout>
  );
};