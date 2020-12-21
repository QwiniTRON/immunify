import react from 'react';
import { CardLink } from '../../components/UI/CardLink';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { makeStyles } from '@material-ui/core/styles';

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
                Icon={<ListAltIcon color="primary" fontSize="large" className={classes.svgIcon} />}
            />

            <CardLink
                title="Выбрать профессию"
                subTitle="Укажите род деятельности, чтобы узнать возможный профессиональный риск"
                to="/data/profession"
            />

            <CardLink
                title="Указать регион"
                subTitle="Укажите регион  проживания, чтобы узнать эпидемиологическую обстановку"
                to="/data/region"
            />

            {/* <CardLink
                title="Ник и ключ доступа"
                subTitle="информация о вас"
                to="/profile/data/region"
            /> */}
        </>
    );
};