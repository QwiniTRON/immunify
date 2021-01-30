import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';

import './profile.scss';

import { RootState } from '../../store';
import { PageLayout } from '../../components/UI/PageLayout';
import { UserCard } from '../../components/UI/UserCard';
import { Layout } from '../../components/Layout/Layout';
import { useCheckUserDataCompleated } from '../../hooks';
import { User, UserModel } from '../../models/User';
import { AppLinkButton } from '../../components/UI/AppLinkButton';
import { s, sif } from '../../utils';
import { getYearOffsetNow } from '../../utils/date';
import { changeCurrentUser } from '../../store/user/action';


type ProfileProps = {

}

const useStyle = makeStyles({
  root: {
    padding: 5
  },

  patientList: {
    boxShadow: '0 0 5px 0 #ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 25
  },

  addButton: {
    width: '100%',
    borderRadius: 10
  },

  patientCard: {
    borderTop: '1px solid #DADADA',
    margin: '0 10px'
  },

  userCard: {
    margin: '0 10px'
  }
});

export const Profile: React.FC<ProfileProps> = (props) => {
  const classes = useStyle();

  const dispatch = useDispatch();

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const user = useSelector((state: RootState) => state.user.user);
  const idUserDataCompleate = useCheckUserDataCompleated();

  let dataStatus: "error" | "success" | undefined = "error";
  let dataText = "не все данные указаны";
  if (idUserDataCompleate) {
    dataStatus = "success";
    dataText = 'всё хорошо';
  };

  return (
    <Layout title="Профиль" domainPage>
      <PageLayout className={sif({ ["profile-page"]: true, ['profile-page--nobackground']: Number(user?.family?.length) > 0 })}>

        <Box fontSize={24} fontWeight="500" p={1} component="h1">Список пользователей</Box>
        <p className="family-page__description">Введите данные о членах вашей семьи, чтобы защитить их от возможных болезней</p>

        <Box className={classes.patientList}>
          <div key={user?.name} onClick={() => dispatch(changeCurrentUser(String(user?.name)))}>
            <UserCard
              active={user == currentUser}
              progress={UserModel.getCompleatedStatus(user as User)}
              title={String(user?.name)}
              to={`/profile/${user?.name}`}
              avatarLetters={String(user?.name)[0]}
              subtitle={(user?.sex == 'man' ? 'мужской' : 'женский') + ', ' + getYearOffsetNow(Number(user?.age))}
              classes={{ root: classes.userCard }} />
          </div>

          {user?.family.map((u) => {
            return (
              <div key={u.name} onClick={() => dispatch(changeCurrentUser(u.name))}>
                <UserCard
                  active={u == currentUser}
                  progress={UserModel.getCompleatedStatus(u)}
                  title={String(u?.name)}
                  subtitle={(u.sex == 'man' ? 'мужской' : 'женский') + ', ' + getYearOffsetNow(u.age)}
                  to={`/profile/${u?.name}`}
                  avatarLetters={String(u?.name)[0]}
                  classes={{ root: classes.patientCard }} />
              </div>
            )
          })}

          <AppLinkButton className={classes.addButton} to="/profile/add" >Добавить пользователя</AppLinkButton>
        </Box>

      </PageLayout>
    </Layout >
  );
};