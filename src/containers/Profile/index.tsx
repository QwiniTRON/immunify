import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import AccountBoxIcon from '@material-ui/icons/AccountBox';

import './profile.scss';

import { RootState } from '../../store';
import { s } from '../../utils/Styels';
import { PageLayout } from '../../components/UI/PageLayout';
import { Link, useHistory } from 'react-router-dom';
import { AppButton } from '../../components/UI/AppButton';
import { UserCard } from '../../components/UI/UserCard';
import { UserData } from '../UserData';
import { Layout } from '../../components/Layout/Layout';
import { CardLink } from '../../components/UI/CardLink';
import { useCheckUserDataCompoeated } from '../../hooks';
import { User, UserModel } from '../../models/User';
import { useServer } from '../../hooks/useServer';
import { AppButtonGroup } from '../../components/UI/ButtonGroup';


type ProfileProps = {

}

const useStyle = makeStyles({
  root: {
    padding: 5
  }
});

export const Profile: React.FC<ProfileProps> = (props) => {
  const classes = useStyle();
  const history = useHistory();

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
    <Layout title="Профиль" domainPage>
      <PageLayout className="profile-page">

        {user?.family.length == 0 ?
          <UserData />
          :
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
                progress={UserModel.getCompleatedStatus(user as User)}
                title={String(user?.name)}
                to={`/profile/${user?.name}`}
                avatarLetters={String(user?.name)[0]} />

              {user?.family.map((u) => {
                return (
                  <UserCard
                    key={u.name}
                    active={u == currentUser}
                    progress={UserModel.getCompleatedStatus(u)}
                    title={String(u?.name)}
                    to={`/profile/${u?.name}`}
                    avatarLetters={String(u?.name)[0]} />
                )
              })}

            </>
          )
        }

        <AppButtonGroup floated>
          <AppButton className="family-page__add" onClick={() => history.push(`/profile/add`)} >добавить</AppButton>
          {user?.family.length == 0 ?
            <AppButton appColor="linear" onClick={() => history.push(`/passport`)} disabled={!idUserDataCompleate}>
              Иммунный паспорт
            </AppButton>
            :
            null
          }
        </AppButtonGroup>

      </PageLayout>
    </Layout >
  );
};