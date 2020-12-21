import react from 'react';
import { CardLink } from '../../components/UI/CardLink';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { makeStyles } from '@material-ui/core/styles';
import {ReactComponent as CaseIcon} from '../../assets/case.svg';
import {ReactComponent as ListIcon} from '../../assets/list.svg';
import {ReactComponent as PlanetIcon} from '../../assets/planet.svg';


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

    return (
        <>
            <CardLink
                title="Пройти опрос"
                subTitle="Ответьте на несколько вопросов, чтобы узнать о возможных рисках"
                to="/data/quiz"
                Icon={<CaseIcon color="primary" fontSize="large" className={classes.svgIcon} />}
            />

            <CardLink
                title="Выбрать профессию"
                subTitle="Укажите род деятельности, чтобы узнать возможный профессиональный риск"
                to="/data/profession"
                Icon={<ListIcon color="primary" fontSize="large" className={classes.svgIcon} />}
            />

            <CardLink
                title="Указать регион"
                subTitle="Укажите регион  проживания, чтобы узнать эпидемиологическую обстановку"
                to="/data/region"
                Icon={<PlanetIcon color="primary" fontSize="large" className={classes.svgIcon} />}
            />

            {/* <CardLink
                title="Ник и ключ доступа"
                subTitle="информация о вас"
                to="/profile/data/region"
            /> */}
        </>
    );
};