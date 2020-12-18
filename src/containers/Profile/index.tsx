import react from 'react';
import { makeStyles } from '@material-ui/styles';
import { Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';

import './profile.scss';

import { RootState } from '../../store';
import { CardLink } from '../../components/UI/CardLink';
import { s } from '../../utils/Styels';
import { PageLayout } from '../../components/UI/PageLayout';
import { Link } from 'react-router-dom';
import { AppButton } from '../../components/UI/AppButton';
import { UserCard } from '../../components/UI/UserCard';

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

  let dataStatus: "error" | "success" | undefined = "error";
  let dataText = "не все данные указаны";
  if (currentUser?.data?.quiz?.length == 5) {
    dataStatus = "success";
    dataText = 'всё хорошо';
  };

  return (
    <PageLayout className="profile-page">
      <CardLink
        title="Я"
        subTitle="данные выбранного пользователя"
        to="/profile/data"
        status={dataStatus}
        statusLabel={dataText}
      />

      {/* <CardLink
        title="Семья"
        subTitle="данные вашей семьи"
        to="/profile/family"
      /> */}

      <p className="family-page__description">Введите данные о членах вашей семьи, чтобы застраховать их от возможных осложнений</p>
      <Link to="/profile/family/add"><AppButton floated className="family-page__add">добавить</AppButton></Link>

      <UserCard
        active={user == currentUser}
        progress={10}
        title={String(user?.name)}
        subtitle={String(user?.age)}
        to={`/profile/family/${user?.name}`}
        avatarLetters={String(user?.name)[0]} />

      {user?.family.map((u) => (
        <UserCard
          key={u.name}
          active={u == currentUser}
          progress={10}
          title={String(u?.name)}
          subtitle={String(u?.age)}
          to={`/profile/family/${u?.name}`}
          avatarLetters={String(u?.name)[0]} />
      ))}
    </PageLayout>
  );
};