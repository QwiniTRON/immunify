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
import { sif } from '../../utils';


type UserDataProps = {

}


const useStyle = makeStyles((theme) => ({
    appcard: {
        margin: "20px 5px"
    },

    svgIcon: {
        color: '#dadada',
        stroke: 'currentColor !important',
        fill: 'currentColor'
    },

    svgIcon__active: {
        color: '#A8E3F1'
    }
}));


export const UserData: React.FC<UserDataProps> = (props) => {
    const classes = useStyle();

    const currentUser = useSelector((state: RootState) => state.user.currentUser);

    const quizStatus = Boolean(currentUser?.data?.quiz?.isDone);

    const quizTitle = quizStatus ? 'Опрос пройден' : 'Пройти опрос';
    const quizText = quizStatus ? new Date(Number(currentUser?.data?.quiz?.lastDate)).toLocaleDateString('ru') :
        'Ответьте на несколько вопросов, чтобы узнать о возможных рисках';
    const quizIconClasses = sif({ [classes.svgIcon]: true, [classes.svgIcon__active]: quizStatus });

    const professionStatus = Boolean(currentUser?.data?.profession);
    const professionTitle = 'Профессия';
    const professionText = professionStatus ? currentUser?.data?.profession?.name :
        'Укажите род деятельности, чтобы узнать возможный профессиональный риск';
    const professionIconClasses = sif({ [classes.svgIcon]: true, [classes.svgIcon__active]: professionStatus });

    const regionStatus = Boolean(currentUser?.data?.region?.main);
    const regionTitle = "Регион";
    const regionText = regionStatus ? currentUser?.data?.region?.main?.name :
        'Укажите регион проживания, чтобы узнать эпидемиологическую обстановку';
    const regionIconClasses = sif({ [classes.svgIcon]: true, [classes.svgIcon__active]: regionStatus });

    return (
        <>
            <Box component="h2">Профиль</Box>
            <Divider />

            <div className={classes.appcard}>
                <CardLink
                    title={quizTitle}
                    subTitle={quizText}
                    to={`/profile/${currentUser?.name}/quiz`}
                    Icon={<ListIcon fontSize="large" className={quizIconClasses} />}
                />
            </div>

            <div className={classes.appcard}>
                <CardLink
                    title={professionTitle}
                    subTitle={professionText}
                    to={`/profile/${currentUser?.name}/profession`}
                    Icon={<CaseIcon fontSize="large" className={professionIconClasses} />}
                />
            </div>

            <div className={classes.appcard}>
                <CardLink
                    title={regionTitle}
                    subTitle={regionText}
                    to={`/profile/${currentUser?.name}/region`}
                    Icon={<PlanetIcon fontSize="large" className={regionIconClasses} />}
                />
            </div>
        </>
    );
};