import react from 'react';
import { CardLink } from '../../components/UI/CardLink';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { ReactComponent as ListIcon } from '../../assets/list.svg';
import { ReactComponent as PlanetIcon } from '../../assets/planet.svg';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


type UserDataProps = {

}


const useStyle = makeStyles((theme) => ({
    svgIcon: {
        fontSize: 60,
        color: 'linear-gradient(91.68deg, #9BC83F -3.91%, #67CDFD 46.87%, #9BC83F 112.32%)'
    }
}));


export const UserData: React.FC<UserDataProps> = (props) => {
    const classes = useStyle();

    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const quizStatus = currentUser?.data?.quiz?.isDone ? 'success' : 'error';
    const quizText = quizStatus === 'success' ? 'пройдено' : 'не пройдено';

    const professionStatus = currentUser?.data?.profession ? 'success' : 'error';
    const professionText = professionStatus === 'success' ? 'пройдено' : 'не указано';

    const regionStatus = Boolean(currentUser?.data?.region?.main) ? 'success' : 'error';
    const regionText = regionStatus === 'success' ? 'пройдено' : 'не указано';

    return (
        <>
            <CardLink
                title="Пройти опрос"
                subTitle="Ответьте на несколько вопросов, чтобы узнать о возможных рисках"
                to={`/profile/${currentUser?.name}/quiz`}
                Icon={<CaseIcon color="primary" fontSize="large" className={classes.svgIcon} />}
                status={quizStatus}
                statusLabel={quizText}
            />

            <CardLink
                title="Выбрать профессию"
                subTitle="Укажите род деятельности, чтобы узнать возможный профессиональный риск"
                to={`/profile/${currentUser?.name}/profession`}
                Icon={<ListIcon color="primary" fontSize="large" className={classes.svgIcon} />}
                status={professionStatus}
                statusLabel={professionText}
            />

            <CardLink
                title="Указать регион"
                subTitle="Укажите регион  проживания, чтобы узнать эпидемиологическую обстановку"
                to={`/profile/${currentUser?.name}/region`}
                Icon={<PlanetIcon color="primary" fontSize="large" className={classes.svgIcon} />}
                status={regionStatus}
                statusLabel={regionText}
            />

            {/* <CardLink
                title="Ник и ключ доступа"
                subTitle="информация о вас"
                to="/profile/data/region"
            /> */}
        </>
    );
};