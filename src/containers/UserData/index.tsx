import react from 'react';
import { CardLink } from '../../components/UI/CardLink';
import { makeStyles } from '@material-ui/core/styles';
import { ReactComponent as CaseIcon } from '../../assets/case.svg';
import { ReactComponent as ListIcon } from '../../assets/list.svg';
import { ReactComponent as PlanetIcon } from '../../assets/planet.svg';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';

import { RootState } from '../../store';
import { Divider } from '../../components';


type UserDataProps = {

}


const useStyle = makeStyles((theme) => ({
    appcard: {
        margin: "20px 5px"
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
            <Box component="h2">Профиль</Box>
            <Divider />
            
            <div className={classes.appcard}>
                <CardLink
                    title="Пройти опрос"
                    subTitle="Ответьте на несколько вопросов, чтобы узнать о возможных рисках"
                    to={`/profile/${currentUser?.name}/quiz`}
                    Icon={<ListIcon fontSize="large" />}
                    status={quizStatus}
                    statusLabel={quizText}
                />
            </div>

            <div className={classes.appcard}>
                <CardLink
                    title="Выбрать профессию"
                    subTitle="Укажите род деятельности, чтобы узнать возможный профессиональный риск"
                    to={`/profile/${currentUser?.name}/profession`}
                    Icon={<CaseIcon fontSize="large" />}
                    status={professionStatus}
                    statusLabel={professionText}
                />
            </div>

            <div className={classes.appcard}>
                <CardLink
                    title="Указать регион"
                    subTitle="Укажите регион проживания, чтобы узнать эпидемиологическую обстановку"
                    to={`/profile/${currentUser?.name}/region`}
                    Icon={<PlanetIcon fontSize="large" />}
                    status={regionStatus}
                    statusLabel={regionText}
                />
            </div>
        </>
    );
};