import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {makeStyles} from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { PageLayout } from '../../components/UI/PageLayout';
import { AppButton } from '../../components/UI/AppButton';

type RegSuccessProps = {

}

const useStyles = makeStyles({
    title: {
        fontSize: 18,
        fontWeight: 500
    }
});

export const RegSuccess: React.FC<RegSuccessProps> = (props) => {
    const classes = useStyles();

    return (
        <PageLayout ButtonBackto="/">
            <Box marginBottom={1}>
                <Typography className={classes.title} variant="h2">поздравляем вы зарегистрированы!</Typography>
            </Box>
            <Box>
                <Typography>Мы за Конфиденциальность ваших данных. По этому мы не храним ваши личные данные на сервере.</Typography>
                <Typography>ваши данные для входа. Эти данные можно будет найти в профиле</Typography>
            </Box>
            <Box>
                <Typography>генерим</Typography>
                <Typography>генерим</Typography>
            </Box>
            <Link to="/">
                <AppButton floated>
                    перейти на главную
                </AppButton>
            </Link>
        </PageLayout>
    );
};