import react from 'react';
import { CardLink } from '../../components/UI/CardLink';
import { PageLayout } from '../../components/UI/PageLayout';

type UserDataProps = {

}

export const UserData: React.FC<UserDataProps> = (props) => {
    return (
        <PageLayout>
            <CardLink
                title="Пройти опрос"
                subTitle="Ответьте на несколько вопросов, чтобы узнать о возможных рисках"
                to="/profile/data/quiz"
            />

            <CardLink
                title="Выбрать профессию"
                subTitle="Укажите род деятельности, чтобы узнать возможный профессиональный риск"
                to="/profile/data/profession"
            />

            <CardLink
                title="Указать регион"
                subTitle="Укажите регион  проживания, чтобы узнатьэпидемиологическую обстановку"
                to="/profile/data/region"
            />
        </PageLayout>
    );
};