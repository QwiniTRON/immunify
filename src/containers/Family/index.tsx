import react from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import './family.scss';

import { AppButton } from '../../components/UI/AppButton';
import { PageLayout } from '../../components/UI/PageLayout';
import { UserCard } from '../../components/UI/UserCard';

type FamilyProps = {

}

const useStyles = makeStyles({
    
});

export const Family: React.FC<FamilyProps> = (props) => {
    const classes = useStyles();

    return (
        <PageLayout className="family-page">
            <p className="family-page__description">Введите данные о членах вашей семьи, чтобы застраховать их от возможных осложнений</p>
            <Link to="/"><AppButton floated className="family-page__add">добавить</AppButton></Link>

            <UserCard active progress={10} title="Степанов Сергей" subtitle="15лет" to="/profile/family/id" avatarLetters="СС" />
            <UserCard progress={100} title="Степанов Андрей" subtitle="45лет" to="/profile/family/id" avatarLetters="СА" />
        </PageLayout>
    );
};