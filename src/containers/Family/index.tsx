import react from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './family.scss';

import { AppButton } from '../../components/UI/AppButton';
import { PageLayout } from '../../components/UI/PageLayout';
import { UserCard } from '../../components/UI/UserCard';
import { RootState } from '../../store';
import { User } from '../../store/types';
import { RoutePrefix } from '../../App';

type FamilyProps = {
    user: User | null
    currentUser: User | null
}

const useStyles = makeStyles({

});

const Family: React.FC<FamilyProps> = ({
    user,
    currentUser
}) => {
    const classes = useStyles();

    return (
        <PageLayout className="family-page">
            <p className="family-page__description">Введите данные о членах вашей семьи, чтобы застраховать их от возможных осложнений</p>
            <Link to={`${RoutePrefix}/profile/family/add`}><AppButton floated className="family-page__add">добавить</AppButton></Link>

            <UserCard
                active={user == currentUser}
                progress={10}
                title={String(user?.name)}
                subtitle={String(user?.age)}
                to={`${RoutePrefix}/profile/family/${user?.name}`}
                avatarLetters={String(user?.name)[0]} />

            {user?.family.map((u) => (
                <UserCard
                    key={u.name}
                    active={u == currentUser}
                    progress={10}
                    title={String(u?.name)}
                    subtitle={String(u?.age)}
                    to={`${RoutePrefix}/profile/family/${u?.name}`}
                    avatarLetters={String(u?.name)[0]} />
            ))}

            {/* <UserCard progress={100} title="Степанов Андрей" subtitle="45лет" to="/profile/family/id" avatarLetters="СА" /> */}
        </PageLayout>
    );
};

const mapStatetoProps = (state: RootState) => ({
    user: state.user.user,
    currentUser: state.user.currentUser
});
const mapDispatchToProps = {};
const connectedFamily = connect(mapStatetoProps, mapDispatchToProps)(Family);
export { connectedFamily as Family };